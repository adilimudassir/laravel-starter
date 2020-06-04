<?php

namespace Domain\Auth\Models;

use Illuminate\Database\Eloquent\Model;
use Altek\Accountant\Contracts\Recordable;
use Spatie\Permission\Models\Role as SpatieRole;

class Role extends SpatieRole implements Recordable
{
    use \Altek\Accountant\Recordable;
}
