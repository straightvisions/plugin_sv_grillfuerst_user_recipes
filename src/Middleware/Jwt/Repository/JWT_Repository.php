<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Jwt\Repository;

use SV_Grillfuerst_User_Recipes\Factory\Query_Factory;

final class JWT_Repository {
    private Query_Factory $Query_Factory;
	private $tableName = 'svgfur_recipes_tokens';

    /**
     * @param Query_Factory     $Query_Factory
     */
    public function __construct(Query_Factory $Query_Factory) {
        $this->Query_Factory = $Query_Factory;
    }

    public function get(string $token): array {
		$query = $this->Query_Factory->newSelect($this->tableName);
		$query->select(
			[
				'*',
			]
		);

		$query->where(['token' => $token]);

		$row = $query->execute()->fetch('assoc');

		return $row ? $row : [];
    }

	public function getByUserId(int $userId): array {
		$query = $this->Query_Factory->newSelect($this->tableName);
		$query->select(
			[
				'*',
			]
		);

		$query->where(['user_id' => $userId]);

		$row = $query->execute()->fetch('assoc');

		return $row ? $row : [];
	}

	public function set(int $userId, string $token, string $exp): array {

		if(empty($this->getByUserId($userId))){
			// insert
			$this->Query_Factory->newInsert($this->tableName, [
				'user_id' => $userId,
				'token' => $token,
				'expires_at' => date('Y-m-d H:i:s', $exp),
			])->execute();
		}else{
			// update
			$this->Query_Factory->newUpdate($this->tableName, [
				'token' => $token,
				'expires_at' => date('Y-m-d H:i:s', $exp)
			])->where(['user_id' => $userId])->execute();
		}

		// @todo use Query instead of get
		return $this->getByUserId($userId);
	}

	public function delete($token): void {
		if (is_string($token)) {
			$this->Query_Factory->newDelete($this->tableName)
			                    ->where(['token' => $token])
			                    ->execute();
		}else{
			// @todo error reporting here
		}
	}

}
