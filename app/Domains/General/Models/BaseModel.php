<?php

namespace Domains\General\Models;

use Illuminate\Database\Eloquent\Model;
use Altek\Accountant\Contracts\Recordable;
use GeneaLabs\LaravelModelCaching\Traits\Cachable;

class BaseModel extends Model implements Recordable
{
    use \Altek\Accountant\Recordable;
    use Cachable;
}
