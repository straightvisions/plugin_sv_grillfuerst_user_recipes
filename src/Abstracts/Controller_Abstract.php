<?php

namespace SV_Grillfuerst_User_Recipes\Abstracts;
use Psr\Container\ContainerInterface;
use SV_Grillfuerst_User_Recipes\Adapters\Adapter;
use SV_Grillfuerst_User_Recipes\Middleware\Jwt\Jwt_Middleware;
abstract class Controller_Abstract {
	protected $Container;
	protected Adapter $Adapter;
	protected Jwt_Middleware $Jwt_Middleware;

	public function __construct(ContainerInterface $Container, Jwt_Middleware $Jwt_Middleware, Adapter $Adapter) {
		$this->Container = $Container;
		$this->Adapter = $Adapter;
		$this->Jwt_Middleware = $Jwt_Middleware;
	}

	/**
	 * Common method to handle rendering views.
	 *
	 * @param string $template Path to the template file.
	 * @param array $data Data to be passed to the view.
	 * @return string Rendered HTML output.
	 */
	protected function render(string $template, array $data = []): string {
		// Example logic for rendering a template.
		extract($data);
		ob_start();
		include $template;
		return ob_get_clean();
	}

	/**
	 * Abstract method that must be implemented by child controllers.
	 *
	 * @param mixed $request
	 * @return mixed
	 */
	abstract public function handle($request);
}
