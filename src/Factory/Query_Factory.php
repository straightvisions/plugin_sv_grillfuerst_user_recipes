<?php

namespace SV_Grillfuerst_User_Recipes\Factory;

use Cake\Database\Connection;
use Cake\Database\Query;
use RuntimeException;

/**
 * Factory.
 */
final class Query_Factory {
    private Connection $connection;

    /**
     * The constructor.
     *
     * @param Connection $connection The database connection
     */
    public function __construct(Connection $connection) {
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
    public function newSelect(string $table): Query {
        return $this->connection->selectQuery()->from($table);
    }

    /**
     * Create an 'update' statement for the given table.
     *
     * @param string $table The table to update rows from
     * @param array $data The values to be updated
     *
     * @return Query The new update query
     */
    public function newUpdate(string $table, array $data): Query {
        return $this->connection->updateQuery()->update($table)->set($data);
    }

    /**
     * Create an 'update' statement for the given table.
     *
     * @param string $table The table to update rows from
     * @param array $data The values to be updated
     *
     * @return Query The new insert query
     */
    public function newInsert(string $table, array $data): Query {
        return $this->connection->insertQuery()->insert(array_keys($data))
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
    public function newDelete(string $table): Query {
        return $this->connection->deleteQuery()->delete($table);
    }

}
