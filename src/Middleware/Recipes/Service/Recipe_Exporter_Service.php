<?php

	namespace SV_Grillfuerst_User_Recipes\Middleware\Recipes\Service;

	use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Repository\Recipe_Repository;
	use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Service\Recipe_Validator_Service;
	use SV_Grillfuerst_User_Recipes\Factory\Logger_Factory;
	use Psr\Log\LoggerInterface;

	final class Recipe_Exporter_Service {
		private Recipe_Repository $repository;

		private Recipe_Validator_Service $Recipe_Validator;

		private LoggerInterface $logger;

		public function __construct(
			Recipe_Repository $repository,
			Recipe_Validator_Service $Recipe_Validator,
			Logger_Factory $Logger_Factory
		) {
			$this->repository = $repository;
			$this->Recipe_Validator = $Recipe_Validator;
			$this->logger = $Logger_Factory
				->addFileHandler('user_updater.log')
				->createLogger();
		}

		public function export(int $recipe_id): void {
			if(!defined('GF_USER_RECIPES_AUTH')){
				die('No Auth set');
			}

			$post_id        = '';
			$post_id        = '/184917'; // TEST DATA WP post ID

			// TEST DATA
			$data   = [
				"created"                   => "2022-11-10 11:08:17",
				"edited"                    => "2022-11-18 14:40:33",
				"state"                     => "draft",
				"uuid"                      => 31688,
				"user_id"                   => 1,
				"title"                     => "Test Rezept",
				"excerpt"                   => "Test Excerpt",
				"servings"                  => 4,
				"featured_image"            => 0,
				"menu_type"                 => 594,
				"kitchen_style"             => 581,
				"difficulty"                => "easy",
				"preparation_time"          => 40,
				"cooking_time"              => 80,
				"waiting_time"              => 120,
				"ingredients"               => [
					[
						'ingredient'        => 721,
						'amount'            => '3',
						'comment'           => 'mehlig kochend',
						'differing_unit'    => '',
						'acf_fc_layout'     => 'ingredient'
					],
					[
						'ingredient'        => 712,
						'amount'            => '6',
						'comment'           => '',
						'differing_unit'    => '',
						'acf_fc_layout'     => 'ingredient'
					]
				],
				"steps"                     => [
					[
						'gallery'           => [],
						'description'       => 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
						'acf_fc_layout'     => 'step'
					],[
						'gallery'           => [],
						'description'       => 'At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
						'acf_fc_layout'     => 'step'
					],[
						'gallery'           => [],
						'description'       => 'Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
						'acf_fc_layout'     => 'step'
					],
				],
				"newsletter"                => false
			];

			// REST Post Array
			$d = json_encode([
				'title'                             => $data['title'],
				'content'                           => '<!-- wp:acf/sv-grillfuerst-custom-recipe-steps {"name":"acf/sv-grillfuerst-custom-recipe-steps","mode":"preview"} /-->',
				'excerpt'                           => $data['excerpt'],
				'featured_media'                    => $data['featured_image'],
				'cp_menutype'                       => [$data['menu_type']],
				'cp_kitchenstyle'                   => [$data['kitchen_style']],
				'acf'                               => [
					'preparation_time'              => $data['preparation_time'],
					'cooking_time'                  => $data['cooking_time'],
					'waiting_time'                  => $data['waiting_time'],
					'difficulty'                    => $data['difficulty'],
					'ingredients'                   => $data['ingredients'],
					'steps'                         => $data['steps'],
					'gf_user_recipe'                => [
						'gf_user_recipe_uuid'       => $data['uuid'],
						'gf_user_recipe_user_id'    => $data['user_id']
					]
				]
			]);

			echo $d;

			$c      = curl_init('https://www.grillfuerst.de/magazin/wp-json/wp/v2/grillrezepte'.$post_id);
			curl_setopt($c, CURLOPT_USERPWD, GF_USER_RECIPES_AUTH);
			curl_setopt($c, CURLOPT_TIMEOUT, 30);
			curl_setopt($c, CURLOPT_POST, 1);
			curl_setopt($c, CURLOPT_CUSTOMREQUEST, "POST");
			curl_setopt($c, CURLOPT_RETURNTRANSFER, TRUE);

			curl_setopt($c, CURLOPT_POSTFIELDS, $d);
			curl_setopt($c, CURLOPT_HTTPHEADER, [
				'Content-Type: application/json',
				'Content-Length: ' . strlen($d)
			]);

			$r = json_decode(curl_exec($c));
			curl_close($c);

			// @todo: add debugging
			// var_dump($r);

			// Logging
			if(isset($r->id)){
				$this->logger->info(sprintf('Recipe exported successfully: %s', $recipe_id));
			}
		}
	}
