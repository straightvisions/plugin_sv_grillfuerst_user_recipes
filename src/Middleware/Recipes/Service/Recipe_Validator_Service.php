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

    public function validate_update(int $userId, array $data): void {
        if (!$this->repository->exists_id($userId)) {
            throw new DomainException(sprintf('User not found: %s', $userId));
        }

        $this->validate_insert($data);
    }

    public function validate_insert($data): void {
        $validator = Validation::createValidator();
        $violations = $validator->validate($data, $this->createConstraints());

        if ($violations->count()) {
            throw new ValidationFailedException('Please check your input', $violations);
        }
    }

    private function createConstraints(): Constraint {
        $constraint = new Constraint_Factory();

        return $constraint->collection(
            [
                //@todo add validations
                'title' => $constraint->required(
                    [
                        $constraint->notBlank(),
                        $constraint->length(null, 255),
                    ]
                ),
            ]
        );
    }
}
