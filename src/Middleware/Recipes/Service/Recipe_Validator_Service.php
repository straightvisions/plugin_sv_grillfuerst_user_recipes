<?php

// doc: https://symfony.com/doc/current/validation.html

namespace SV_Grillfuerst_User_Recipes\Middleware\Recipes\Service;

use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Repository\Recipe_Repository;
use SV_Grillfuerst_User_Recipes\Factory\Constraint_Factory;
use DomainException;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\Exception\ValidationFailedException;
use Symfony\Component\Validator\Validation;

final class Recipe_Validator_Service {
    private Recipe_Repository $repository;

    public function __construct(Recipe_Repository $repository) {
        $this->repository = $repository;
    }

    public function validate_update(int $user_id, array $data): void {
        if (!$this->repository->exists_id($user_id)) {
            $errors = ['user_id'=>'User not found: '.$user_id];

            $Response = new \stdClass();
            $Response->errors = $errors;
            wp_send_json($Response);
        }

        $this->validate_insert($data);
    }

    public function validate_insert($data): void {
        $validator = Validation::createValidator();
        $violations = $validator->validate($data, $this->createConstraints());
        
        if ($violations->count()) {
            $errors = [];
            for($i = 0; $i < $violations->count(); ++$i){
                $errors[$violations->get($i)->getPropertyPath()] =
                    $violations->get($i)->getMessage();
            }

            //@todo migrate this to an adapter + response class
            $Response = new \stdClass();
            $Response->errors = $errors;

            wp_send_json($Response);
        }
    }

    private function createConstraints(): Constraint {
        $constraint = new Constraint_Factory();

        return $constraint->collection(
            [
                //@todo add validations
                'title' => $constraint->optional(
                    [
                        $constraint->notBlank(),
                        $constraint->length(null, 255),
                    ]
                ),
                'excerpt' => $constraint->optional(
                    [
                        $constraint->notBlank(),
                        $constraint->length(null, 500),
                    ]
                ),
                'categories' => $constraint->optional(
                    [
                        $constraint->type('array')
                    ]
                ),
                'portions' => $constraint->optional(
                    [
                        $constraint->type('array')
                    ]
                ),
                'feature_image' => $constraint->optional(
                    [
                        $constraint->type('array')
                    ]
                ),
                'menu_type' => $constraint->optional(
                    [
                        $constraint->type('integer')
                    ]
                ),
                'kitchen_style' => $constraint->optional(
                    [
                        $constraint->type('integer')
                    ]
                ),
                'difficulty' => $constraint->optional(
                    [
                        $constraint->notBlank(),
                        $constraint->type('string')
                    ]
                ),
                'preparation_time' => $constraint->optional(
                    [
                        $constraint->type('integer')
                    ]
                ),
                'cooking_time' => $constraint->optional(
                    [
                        $constraint->type('integer')
                    ]
                ),
                'waiting_time' => $constraint->optional(
                    [
                        $constraint->type('integer')
                    ]
                ),
                'ingredients' => $constraint->optional(
                    [
                        $constraint->type('array')
                    ]
                ),
                'steps' => $constraint->optional(
                    [
                        $constraint->type('array')
                    ]
                ),
                'newsletter' => $constraint->optional(
                    [
                        $constraint->type('boolean')
                    ]
                ),
            ]
        );
    }
}
