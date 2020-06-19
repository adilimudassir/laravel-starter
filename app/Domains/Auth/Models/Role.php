<?php

namespace Domains\Auth\Models;

use Altek\Accountant\Contracts\Recordable;
use Spatie\Permission\Models\Role as SpatieRole;

class Role extends SpatieRole implements Recordable
{
    use \Altek\Accountant\Recordable;
}
