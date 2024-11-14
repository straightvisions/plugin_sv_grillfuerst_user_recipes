<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Recipes\Repository;

use SV_Grillfuerst_User_Recipes\Factory\Query_Factory;

final class Recipe_Finder_Repository {
    private Query_Factory $Query_Factory;
    private $totalRows = 0;
    private $totalPages = 1;
    private $currentPage = 1;
	private $table_name = 'svgfur_recipes';

    /**
     * @param Query_Factory     $Query_Factory
     */
    public function __construct(Query_Factory $Query_Factory) {
        $this->Query_Factory = $Query_Factory;
    }

    private function parse_filter($filter){
        $parsed = [];

        foreach($filter as $key => $pair){
			if(is_null($pair[0])) continue;
            $parsed[$pair[0]] = $pair[1];
        }

        return $parsed;
    }

    public function get(array|null $params = []): array {
		// limitations
        $limit = isset($params['limit']) ? (int)$params['limit'] : false;
        $page = isset($params['page']) ? (int)$params['page'] : false;
        $order = isset($params['order']) ? explode(' ',$params['order']) : ['created', 'DESC'];
        $where = $this->build_where($params);

		// create query
        $query = $this->Query_Factory->newSelect($this->table_name);
        $query->select(['*']);
        $query->where($where);

        if($order){
            $query->orderBy([
                $order[0] => isset($order[1]) ? $order[1] : 'ASC'
            ]);
        }

        // counting before limit
        $this->apply_counting($query, $params);

        // pagination
        if($limit) $query->limit($limit);
        if($page) $query->page($page);

        return $query->execute()->fetchAll('assoc') ?: [];
    }

	private function build_where(array|null $params): array {
		$where = [];

		$filter = isset($params['filter']) ? $this->parse_filter($params['filter']) : [];

		// decode filter to where array
		if(empty($filter) === false){

			// filter by uuid
			if(isset($filter['uuid'])  && empty((int)$filter['uuid']) === false){
				$where['uuid'] = (int)$filter['uuid'];
				unset($filter['uuid']);
			}

			if(isset($filter['user_id']) && empty($filter['user_id']) === false){
				$where['user_id'] = (int)$filter['user_id'];
				unset($filter['user_id']);
			}

			if(isset($filter['state'])  && empty($filter['state']) === false){
				$state = strtolower($filter['state']);
				if($state !== 'all'){
					$where['state'] = $state;
				}

				unset($filter['state']);
			}

			// check if more filter fields are present
			// this will result in user_id AND uuid AND ( filter1 OR filter2)
			if(empty($filter) === false){
				$where['OR'] = [];
			}

			// replace this later
			// text search field
			if(isset($filter['query'])){
				$query = explode(',', $filter['query']);

				if(is_array($query)){
					foreach($query as $key => $val){
						if(empty($val)) continue;
						$query[$key] = trim($val);
						$where['OR'][] = ['title LIKE' => '%'.$query[$key].'%'];
						$where['OR'][] = ['uuid' => (int) $query[$key]];
					}

				}
			}
		}

		return $where;
	}

    public function getRaw($id){
        $query = $this->Query_Factory->newSelect($this->table_name);

        $query->select(
            [
                '*',
            ]
        );

        // filter by user id
        $query->where(['uuid' => (int)$id]);

        return $query->execute()->fetch('assoc') ?: [];
    }

	// legacy function, keep for compatibility
    public function get_by_user_id($id, array $params = []): array {
		$params['filter']['user_id'] = $id;
		return $this->get($params);
    }

	// legacy function, keep for compatibility
    public function get_by_recipe_id_and_user_id($id1, $id2): array {
	    $params['filter']['uuid'] = $id1;
	    $params['filter']['user_id'] = $id2;
	    return $this->get($params);
    }

    private function apply_counting($query, array $params = []){
        $this->totalRows = $query->execute()->rowCount();
        $this->totalPages = isset($params['limit']) ? ceil($this->totalRows / (int)$params['limit']) : 1;
        $this->currentPage = isset($params['page']) ? (int)$params['page'] : 1;
    }

    public function get_totals(): array{
        return [
            'pages' => $this->totalPages,
            'rows' => $this->totalRows,
            'page' => $this->currentPage,
        ];
    }

    public function get_total_rows(): int{
        return $this->totalRows;
    }

    public function get_total_pages(): int{
        return $this->totalPages;
    }

    public function get_current_page(): int{
        return $this->currentPage;
    }
}
