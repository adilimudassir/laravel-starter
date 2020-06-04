<?php

namespace Domain\Auth\Models;

use Illuminate\Database\Eloquent\Model;
use Altek\Accountant\Contracts\Recordable;
use Spatie\Permission\Models\Permission as SpatiePermission;

class Permission extends SpatiePermission implements Recordable
{
    use \Altek\Accountant\Recordable;
}
