<?php

namespace App\Domain\Auth\Models\Auth;

use Illuminate\Database\Eloquent\Model;
use Altek\Accountant\Contracts\Recordable;
use Spatie\Permission\Models\Role as SpatieRole;

class Role extends SpatieRole implements Recordable
{
    use \Altek\Accountant\Recordable;
}
