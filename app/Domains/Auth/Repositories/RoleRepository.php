<?php
namespace Domains\Auth\Repository;

use Domains\Auth\Models\Role;
use App\Repositories\BaseRepository;

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