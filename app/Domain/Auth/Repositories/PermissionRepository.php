<?php
namespace App\Domain\Auth\Repository;

use App\Repositories\BaseRepository;
use App\Domain\Auth\Models\Auth\Permission;

class PermissionRepository extends BaseRepository
{
    /**
     * create an instance of the class
     *
     * @param Permission $permission
     */
    public function __construct(Permission $permission)
    {
        $this->model = $permission;
    }
}