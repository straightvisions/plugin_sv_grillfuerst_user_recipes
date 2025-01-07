<?php

namespace SV_Grillfuerst_User_Recipes\Frontend;

use SV_Grillfuerst_User_Recipes\Abstracts\Controller_Abstract;

final class Frontend_Controller extends Controller_Abstract {
	protected $public_path = __DIR__ . '/../../public';
	protected $template_path = __DIR__ . '/../Templates';
	/**
	 * Handle the incoming request.
	 *
	 * @param mixed $request
	 * @return string Rendered HTML for the appropriate dashboard.
	 */
	public function handle($request) {
		return 'hello world';
	}

	private function get_public_path(string $path){
		$realpath = realpath($this->public_path);
		if ($realpath === false) throw new \RuntimeException('Templates directory not found: ' . __DIR__ . '/../Templates');
		return $realpath . '/' . rtrim($path, '/');
	}

	private function get_template_path(string $path){
		$realpath = realpath($this->template_path);
		if ($realpath === false) throw new \RuntimeException('Templates directory not found: ' . __DIR__ . '/../Templates');
		return $realpath . '/' . rtrim($path, '/');
	}

	/**
	 * Render the admin dashboard.
	 *
	 * @return string Rendered HTML for the admin dashboard.
	 */
	public function render_admin_dashboard(): string {
		$data = [
			'token'=>$this->Jwt_Middleware->create(
				[
					'userId' => \get_current_user_id(),
					'role'=> 'admin',
					'can' => ['view','edit','delete','export']
				])
		];

		// wordpress specific asset loader
		$this->Adapter->Asset()->add('sv_grillfuerst_admin_dashboard_app', 'public/react/admin/admin_dashboard.build.js',
			$data);

		return $this->render($this->get_template_path('Admin/dashboard.php'), $data);
	}

	/**
	 * Render the user dashboard.
	 *
	 * @return string Rendered HTML for the user dashboard.
	 */
	private function render_user_dashboard(): string {
		// Path to your user dashboard template
		$template = '/path/to/user_dashboard.php';

		// Example data for the user dashboard
		$data = [
			'title' => 'User Dashboard',
			'welcomeMessage' => 'Welcome back, User!',
		];

		return $this->render($template, $data);
	}

}
