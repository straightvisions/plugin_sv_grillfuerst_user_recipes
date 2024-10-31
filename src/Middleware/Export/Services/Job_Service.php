<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Export\Services;

use Cake\Database\Connection;
use Psr\Container\ContainerInterface;

use Exception;
final class Job_Service {
	private $schema = [
		'status'=>'string',
		'priority'=>'int',
		'type'=>'string',
		'callback'=>'string',
		'item_id'=>'int',
		'data'=>'json'
	];

	protected Connection $connection;
	protected ContainerInterface $container;
	private $table = 'svgfur_jobs';

	public function __construct(
		Connection $connection,
		ContainerInterface $container
	) {
		$this->connection = $connection;
		$this->container = $container;

		// @todo wordpress specific function
		\add_action('sv_grillfuerst_user_recipes_run_job', [$this, 'run_job'], 10, 1);
	}

	public function run_job($id){
		$job = $this->get($id);

		if(empty($job)) throw new Exception(__FUNCTION__ .' couldn\'t run job - job not found - args id: ' .  $id);
		if($job['status'] === 'error') throw new Exception(__FUNCTION__ .' couldn\'t run job - job has status "error" - job id: ' . $job['id']);
		if($job['status'] === 'done') throw new Exception(__FUNCTION__ .' couldn\'t run job - job has status "done" - job id: ' . $job['id']);
		if(empty($job['callback'])) throw new Exception(__FUNCTION__ .' couldn\'t run job - job has no callback - job id: ' . $job['id']);

		$command = explode('::', $job['callback']);
		$className = $command[0];
		$methodName = $command[1] ?? null;

		try{
			// Check if both class and method are specified
			if ($methodName && method_exists($className, $methodName)) {
				// Resolve the class instance from the container
				$classInstance = $this->container->get($className);
				$this->connection->update($this->table, ['status'=>'running'], ['id'=>$id]);
				// Call the method on the resolved class instance
				$success = $classInstance->{$methodName}($job); // Pass job data as an argument if needed

				if($success){
					$this->connection->update($this->table, ['status'=>'done'], ['id'=>$id]);
					\wp_clear_scheduled_hook('sv_grillfuerst_user_recipes_run_job', [$id]);
				}else{
					$this->connection->update($this->table, ['status'=>'error'], ['id'=>$id]);
				}

				return true;
			} else {
				throw new Exception(__FUNCTION__ . " Invalid callback specified for job ID {$id}");
			}
		}catch(Exception $e){
			error_log($e->getMessage());
			return $e->getMessage();
		}

	}

	public function create(array $job): array{
		$data = [];

		foreach($job as $key => $val){
			if(isset($this->schema[$key])){
				//@todo add data type checks here
				$data[$key] = $val;
			}
		}

		//@todo add error handling and last inserted id
		if(!empty($data)){

			if(isset($data['data']) && !is_string($data['data']) && !empty($data['data'])) $data['data'] = json_decode($data['data']);

			$this->connection->insert($this->table, $data);

			$job_id = $this->connection->getDriver()->lastInsertId();

			if (!\wp_next_scheduled('sv_grillfuerst_user_recipes_run_job', ['id' => (int)$job_id])) {
				\wp_schedule_event(time(), 'every_minute', 'sv_grillfuerst_user_recipes_run_job', ['id' => (int)$job_id]);
			}

		}

		return $this->get($job_id);
	}

	public function update(int $id, array $data): bool {
		if(isset($data['data']) && !is_string($data['data'])){
			$data['data'] = json_encode($data['data']);
		}
		$this->connection->update($this->table, $data, ['id' => $id], ['id' => 'integer']);
		return true;
	}

	public function get(int $id = 0): array{
		if(empty($id)){
			$data = $this->connection->selectQuery(['*'], $this->table)->execute()->fetchAll('assoc');
			foreach($data as $key => &$item){
				$item['data'] = $this->prepare_data($item['data']);
			}
		}else{
			$data = $this->connection->selectQuery(['*'], $this->table)->where(['id' => $id])->execute()->fetchAssoc();
			$data['data'] = $this->prepare_data($data['data']);
		}

		return $data;
	}

	public function get_by_item_id(int $item_id): array{
		$data = $this->connection->selectQuery(['*'], $this->table)->where(['item_id'=>$item_id])->execute()->fetchAll('assoc');
		foreach($data as $key => &$item){
			$item['data'] = $this->prepare_data($item['data']);
		}

		return $data;
	}

	public function delete_by_item_id(int $item_id): void{
		$items = $this->connection->selectQuery(['id'], $this->table)->where(['item_id' => $item_id])->execute()->fetchAll('assoc');
		// delete cron jobs
		foreach($items as $key => $item){
			$id = isset($item['id']) ? (int)$item['id'] : 0;
			if($id){
				\wp_clear_scheduled_hook('sv_grillfuerst_user_recipes_run_job', ['id' => $id]);
			}

		}

		$this->connection->deleteQuery($this->table, ['item_id'=>$item_id])->execute();
	}

	protected function prepare_data(mixed $data){
		if(is_string($data)){
			$data = json_decode($data, true);
		}
		if(empty($data)){
			$data = [];
		}

		return $data;
	}
}