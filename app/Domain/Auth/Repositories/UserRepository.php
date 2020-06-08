<?php
namespace Domains\Auth\Repositories;

use Domains\Auth\Models\User;
use App\Repositories\BaseRepository;

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