<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Recipes\Repository;

use SV_Grillfuerst_User_Recipes\Factory\Query_Factory;

final class Recipe_Finder_Repository {
    private Query_Factory $Query_Factory;
    private $totalRows = 0;
    private $totalPages = 1;
    private $currentPage = 1;

    /**
     * @param Query_Factory     $Query_Factory
     */
    public function __construct(Query_Factory $Query_Factory) {
        $this->Query_Factory = $Query_Factory;
    }

    public function get($id = null, array $params = []): array {
        $query = $this->Query_Factory->newSelect('svgfur_recipes');

        $query->select(
            [
                '*',
            ]
        );

        // filter by recipe id
        if($id){
            $query->where(['uuid' => (int)$id]);
        }

        // counting before limit
        $this->apply_counting($query, $params);

        // pagination
        if($params['limit']) $query->limit((int)$params['limit']);
        if($params['page']) $query->page((int)$params['page']);

        return $query->execute()->fetchAll('assoc') ?: [];
    }

    public function get_by_user_id($id, array $params = []): array {
        $query = $this->Query_Factory->newSelect('svgfur_recipes');

        $query->select(
            [
                '*',
            ]
        );

        // filter by user id
        $query->where(['user_id' => (int)$id]);

        // counting before limit
        $this->apply_counting($query, $params);

        // pagination
        if($params['limit']) $query->limit((int)$params['limit']);
        if($params['page']) $query->page((int)$params['page']);

        return $query->execute()->fetchAll('assoc') ?: [];
    }

    public function get_by_recipe_id_and_user_id($id1, $id2): array {
        $query = $this->Query_Factory->newSelect('svgfur_recipes');

        $query->select(
            [
                '*',
            ]
        );

        // filter by recipe id + user id
        $query->where(['uuid' => (int)$id1, 'user_id' => (int)$id2]);

        // counting before limit
        $this->apply_counting($query);

        return $query->execute()->fetchAll('assoc') ?: [];
    }

    private function apply_counting($query, array $params = []){
        $this->totalRows = $query->execute()->count();
        $this->totalPages = $params['limit'] ? ceil($this->totalRows / (int)$params['limit']) : 1;
        $this->currentPage = $params['page'] ? (int)$params['page'] : 1;
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
