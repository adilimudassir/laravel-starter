<?php
namespace Domains\General\Models;

use Illuminate\Database\Eloquent\Model;
use Altek\Accountant\Contracts\Recordable;

class BaseModel extends Model implements Recordable
{
    use \Altek\Accountant\Recordable;
}