<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Export\Services;

use Cake\Database\Connection;
use Psr\Container\ContainerInterface;

use Exception;
//@todo remove cron schedule functions after testing the new heartbeat flow
final class Job_Service {
	private $schema = [
		'status'=>'string',
		'priority'=>'int',
		'type'=>'string',
		'callback'=>'string',
		'item_id'=>'int',
		'data'=>'json',
		'log'=>[]
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
		//\add_action('sv_grillfuerst_user_recipes__job', [$this, 'run_job'], 10, 1);
	}

	public function run_next(): void{
		$jobs = $this->get(); // ascending order

		foreach($jobs as $key => $job){
			try{
				// this validates for status and blocker, so just run the next valid non-blocking job
				$this->validate_job($job);
				$success = $this->run_job($job['id']);
				if($success) break;
			}catch(Exception $e){
				continue;
			}
		}
	}

	public function run_job($id){
		error_log('Job Service - run_job - try to run '.$id);
		try{
			// get job
			$job = $this->get($id);
			// validate job
			$this->validate_job($job);
			// extract callback
			$command = explode('::', $job['callback']);
			$className = $command[0];
			$methodName = $command[1] ?? null;
			// Resolve the class instance from the container
			$classInstance = $this->container->get($className);
			/////////////////////////////////////
			$this->connection->update($this->table, ['status'=>'running'], ['id'=>$id]);
			$classInstance->{$methodName}($job);
			$this->connection->update($this->table, ['status'=>'done'], ['id'=>$id]);
			/////////////////////////////////////
			//@todo add "duration" to the job, if it has "single" -> delete the cron
			//\wp_clear_scheduled_hook('sv_grillfuerst_user_recipes_run_job', ['id'=>$id]);
			error_log('Job Service - run_job - run completed '.$id);
			return true;
		}catch(Exception $e){
			if($e->getCode() > 300 ) $this->log($job, $e->getMessage()); // log only real errors
			$this->handle_job_status_by_exception_code($job, $e->getCode());
			error_log('Job Service - run_job - run failed '.$id . ' - message: '. $e->getMessage());
			return false;
		}

	}

	public function log($job, string|array $message){
		if(is_array($message)){
			$job['log'] = array_merge($job['log'], $message);
		}else{
			$job['log'][] = $message;
		}

		$this->connection->update($this->table, ['log'=>json_encode($job['log'])], ['id'=>$job['id']]);
	}

	public function validate_job($job){
		// job not found
		if(empty($job)) throw new Exception(__FUNCTION__ .' couldn\'t run job - job not found - id: ' .  $job['id'], 404);
		// job has status error
		if($job['status'] === 'error') throw new Exception(__FUNCTION__ .' couldn\'t run job - job has status "error" - job id: ' . $job['id'], 500);
		// job has status done
		if($job['status'] === 'done') throw new Exception(__FUNCTION__ .' couldn\'t run job - job has status "done" - job id: ' . $job['id'], 100);
		// job already running
		if($job['status'] === 'running') throw new Exception(__FUNCTION__ .' couldn\'t run job - job has status "running" - job id: ' . $job['id'], 423);
		// callback is missing
		if(empty($job['callback'])) throw new Exception(__FUNCTION__ .' couldn\'t run job - job has no callback - job id: ' . $job['id'], 500);
		// callback validation
		$command = explode('::', $job['callback']);
		$className = $command[0];
		$methodName = $command[1] ?? null;
		if (!$methodName || !method_exists($className, $methodName)) throw new Exception(__FUNCTION__ . ' Invalid callback declared for job ID ' . $job['id'], 500);
		// performance
		if($job['type'] === 'media' && $this->is_another_running('media', $job['id'])) throw new Exception(__FUNCTION__ .' couldn\'t run job - another job of type media is running right now - job id: ' . $job['id'], 102);
	}

	public function handle_job_status_by_exception_code($job, int $code){
		$job_id = empty($job) || empty($job['id']) ? 0 : $job['id'];
		if($code === 100){
			$this->connection->update($this->table, ['status'=>'done'], ['id'=>$job_id]);
		}

		if($code === 102){
			$this->connection->update($this->table, ['status'=>'pending'], ['id'=>$job_id]);
		}

		if($code === 404){
			$this->connection->update($this->table, ['status'=>'error'], ['id'=>$job_id]);
		}

		if($code === 423){
			// nothing
		}

		if($code === 500){
			$this->connection->update($this->table, ['status'=>'error'], ['id'=>$job_id]);
		}

	}

	private function is_another_running(string $type, int $id){
		$jobs = $this->connection->selectQuery(['*'], $this->table)->where(['status'=>'running', ['type'=>$type, 'id !=' => $id]])->execute()->fetchAll('assoc');
		return count($jobs) > 0;
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
			if(isset($data['log']) && !is_string($data['log']) && !empty($data['log'])) $data['log'] = json_decode($data['log']);

			$this->connection->insert($this->table, $data);
			$job_id = $this->connection->getDriver()->lastInsertId();
		}

		return $this->get($job_id);
	}

	public function update(int $id, array $data): bool {
		if(isset($data['data']) && !is_string($data['data'])){
			$data['data'] = !is_string($data['data']) ? json_encode($data['data']) : json_encode($data['data']);
			$data['log'] = !is_string($data['log']) ? json_encode($data['log']) : json_encode($data['log']);
		}

		$this->connection->update($this->table, $data, ['id' => $id], ['id' => 'integer']);
		return true;
	}

	public function get(int $id = 0): array{
		if(empty($id)){
			$data = $this->connection->selectQuery(['*'], $this->table)->execute()->fetchAll('assoc');
			foreach($data as $key => &$item){
				if(empty($item) || !isset($item['data']) || empty($item['data'])) continue;
				$item['data'] = $this->prepare_data($item['data']);
				$item['log'] = $this->prepare_data($item['log']);
			}
		}else{
			$data = $this->connection->selectQuery(['*'], $this->table)->where(['id' => $id])->execute()->fetchAssoc();
			$data['data'] = $this->prepare_data($data['data']);
			$data['log'] = $this->prepare_data($data['log']);
		}

		return $data ? $data : [];
	}


	public function get_by_item_id(int $item_id): array{
		$data = $this->connection->selectQuery(['*'], $this->table)->where(['item_id'=>$item_id])->orderBy(['priority' => 'DESC'])->execute()->fetchAll('assoc');
		foreach($data as $key => &$item){
			$item['data'] = $this->prepare_data($item['data']);
			$item['log'] = $this->prepare_data($item['log']);
		}

		return $data;
	}

	public function delete_by_item_id(int $item_id): void{
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