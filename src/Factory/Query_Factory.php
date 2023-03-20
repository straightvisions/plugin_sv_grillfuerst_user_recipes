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

    // @todo replace this with cake php connection when out of beta
    public function newBulkInsert(string $table_name, array $items){
        global $wpdb;

        $first_item = reset( $items );
        $keys = array_keys( $first_item );

        $placeholders = array_fill( 0, count( $keys ), '%s' );
        $placeholder_string = '(' . implode( ', ', $placeholders ) . ')';
        $value_strings = array();

        foreach ( $items as $item ) {
            $values = array();
            foreach ( $keys as $key ) {
                $values[] = $item[ $key ];
            }
            $value_strings[] = $wpdb->prepare( $placeholder_string, $values );
        }

        $sql = "INSERT INTO $table_name (" . implode( ', ', $keys ) . ") VALUES " . implode( ', ', $value_strings );
        $update_sql = " ON DUPLICATE KEY UPDATE ";
        foreach ( $keys as $key ) {
            $update_sql .= "$key=VALUES($key), ";
        }
        $update_sql = rtrim( $update_sql, ', ' );

        $wpdb->query( $sql . $update_sql );
    }
    // bulk cake
    /*
    public function newBulkInsert(string $table, array $list): mixed {

        if(empty($list))return false;


        $keys = implode(',', array_keys($list[0]));

        $sql = 'INSERT INTO '.$table.' ('.$keys.') VALUES ';
        foreach($list as $key => $item){
            $tmp = implode('#####,####', $item);
            $tmp = json_encode($tmp);
            $tmp = str_replace('####,####', "','");
            $tmp = "('".$tmp."')";
            $sql .= $tmp;

            //@todo optimise this
            if($key+1 === count($list)){
                $sql .= ';';
            }else{
                $sql .= ',';
            }
        }

        return $this->connection->execute($sql);
    }
    */

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
