<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Export\Services;

use Cake\Database\Connection;

final class Recipes_Service {
	protected $connection;
	private $table = 'svgfur_recipes';

	public function __construct(Connection $connection) {
		$this->connection = $connection;
	}

	// Get a list of recipes
	public function get_list(): array {
		$statement = $this->connection->execute('SELECT * FROM ' . $this->table);
		return $statement->fetchAll('assoc');
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
}
