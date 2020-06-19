<?php

namespace Domains\Auth\Repository;

use App\Repositories\BaseRepository;
use Domains\Auth\Models\Role;

class RoleRepository extends BaseRepository
{
    /**
     * create instance of the class.
     *
     * @param Role $role
     */
    public function __construct(Role $role)
    {
        $this->model = $role;
    }
}
