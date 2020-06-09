<?php
namespace Domains\Auth\Repository;

use Domains\Auth\Models\Permission;
use App\Repositories\BaseRepository;

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