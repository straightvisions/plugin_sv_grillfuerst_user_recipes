<?php

namespace SV_Grillfuerst_User_Recipes\Factory;

use RuntimeException;

/**
 * Factory.
 */
final class Query_Factory {
	private $connection;

	/**
	 * The constructor.
	 *
	 * @param $connection The database connection
	 */
	public function __construct($connection) {
		$this->connection = $connection;
	}

	/**
	 * Create a new 'select' query for the given table.
	 *
	 * @param string $table The table name
	 *
	 * @throws RuntimeException
	 *
	 * @return Query A new select query
	 */
	public function new_select(string $table): Query {
		return $this->new_query()->from($table);
	}

	/**
	 * Create a new query.
	 *
	 * @return Query The query
	 */
	public function new_query(): Query {
		return $this->connection->new_query();
	}

	/**
	 * Create an 'update' statement for the given table.
	 *
	 * @param string $table The table to update rows from
	 * @param array $data The values to be updated
	 *
	 * @return Query The new update query
	 */
	public function new_update(string $table, array $data): Query {
		return $this->new_query()->update($table)->set($data);
	}

	/**
	 * Create an 'update' statement for the given table.
	 *
	 * @param string $table The table to update rows from
	 * @param array $data The values to be updated
	 *
	 * @return Query The new insert query
	 */
	public function new_insert(string $table, array $data): Query {
		return $this->new_query()->insert(array_keys($data))
			->into($table)
			->values($data);
	}

	/**
	 * Create a 'delete' query for the given table.
	 *
	 * @param string $table The table to delete from
	 *
	 * @return Query A new delete query
	 */
	public function new_delete(string $table): Query {
		return $this->new_query()->delete($table);
	}
}
