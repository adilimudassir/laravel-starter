<?php
namespace App\Domain\Auth\Repositories;

use App\Repositories\BaseRepository;
use Domain\Auth\Models\User;

class UserRepository extends BaseRepository
{
    /**
     * create an instance of the class
     *
     * @param User $user
     */
    public function __construct(User $user)
    {
        $this->model = $user;
    }

}