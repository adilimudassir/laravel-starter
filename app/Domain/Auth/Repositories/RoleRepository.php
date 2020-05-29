<?php
namespace App\Domain\Auth\Repository;

use App\Repositories\BaseRepository;
use App\Domain\Auth\Models\Auth\Role;

class RoleRepository extends BaseRepository
{
    /**
     * create instance of the class
     *
     * @param Role $role
     */
    public function __construct(Role $role)
    {
        $this->model = $role;
    }
}