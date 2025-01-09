<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Export\Services;

use Cake\Database\Connection;
use Cake\Database\Query\QueryFactory;
use Cake\Database\Expression\QueryExpression;
use Cake\Database\Query\SelectQuery;
final class Recipes_Service {
	protected $connection;
	private $table = 'svgfur_recipes';

	public function __construct(Connection $connection) {
		$this->connection = $connection;
	}

	/* usage:
	$params = [
    'conditions' => ['status' => 'active', 'category_id' => 3],
    'order' => ['created_at' => 'DESC'],
    'limit' => 10,
    'offset' => 0,
	];
	 */
	// @todo should use data model here for security reasons

	public function get_list(array $params = []): array {
		// Get a query factory instance
		$queryFactory = new QueryFactory($this->connection);

		// Determine the columns to select
		$columns = $params['columns'] ?? '*';

		// Start building the query
		$query = $queryFactory->select($columns)
		                      ->from($this->table);

		// Add WHERE conditions
		if (!empty($params['conditions'])) {
			//@todo broken in 5.1
			/*
			$query->where(function (QueryExpression $exp, SelectQuery $q) use ($params) {
				$conditions = $params['conditions'];

				// Handle AND conditions
				if (!empty($conditions['AND'])) {
					foreach ($conditions['AND'] as $field => $value) {
						if (is_array($value)) {
							$exp->in($field, $value);
						} else {
							$exp->eq($field, $value);
						}
					}
				}

				// Handle OR conditions
				if (!empty($conditions['OR'])) {
					$exp->or(function (QueryExpression $or) use ($conditions) {
						foreach ($conditions['OR'] as $field => $value) {
							if (is_array($value)) {
								$or->in($field, $value);
							} else {
								$or->eq($field, $value);
							}
						}
						return $or;
					});
				}

				return $exp;
			});*/
		}

		// Add ORDER BY clause
		if (!empty($params['order'])) {
			foreach ($params['order'] as $field => $direction) {
				$query->order([$field => strtoupper($direction) === 'DESC' ? 'DESC' : 'ASC']);
			}
		}

		// Add LIMIT and OFFSET
		if (!empty($params['limit'])) {
			$query->limit((int)$params['limit']);
		}
		if (!empty($params['offset'])) {
			$query->offset((int)$params['offset']);
		}

		// Execute the query and fetch results
		return $query->execute()->fetchAll('assoc');
	}

	// Get a single recipe by ID
	public function get(int $uuid): ?array {
		$statement = $this->connection->execute(
			'SELECT * FROM '.$this->table.' WHERE uuid = :uuid',
			['uuid' => $uuid],
			['uuid' => 'integer']
		);
		return $statement->fetch('assoc') ?: null; // no model use?
	}

	// Update a recipe by ID
	public function update(int $uuid, array $data): bool {
		$this->connection->update($this->table, $data, ['uuid' => $uuid], ['uuid' => 'integer']);
		return true;
	}

	public function get_count(array $conditions): int {
		return 20;
		$queryFactory = new QueryFactory($this->connection);

		$query = $queryFactory->select()
		                      ->select(['count' => 'COUNT(*)'])
		                      ->from($this->table);
		// Add WHERE conditions
		if (!empty($conditions)) {
			$query->where(function (QueryExpression $exp, SelectQuery $q) use ($conditions) {
				if (!empty($conditions['AND'])) {
					foreach ($conditions['AND'] as $field => $value) {
						if (is_array($value)) {
							$exp->in($field, $value);
						} else {
							$exp->eq($field, $value);
						}
					}
				}

				if (!empty($conditions['OR'])) {
					$exp->or(function (QueryExpression $or) use ($conditions) {
						foreach ($conditions['OR'] as $field => $value) {
							if (is_array($value)) {
								$or->in($field, $value);
							} else {
								$or->eq($field, $value);
							}
						}
						return $or;
					});
				}

				return $exp;
			});
		}

		// Execute and fetch count
		return (int)$query->execute()->fetch('assoc')['count'];
	}

}
