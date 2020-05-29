<?php
namespace App\Domain\General\Models;

use App\Domain\General\Models\BaseModel;
use Altek\Accountant\Contracts\Recordable;

class BaseModel extends Model implements Recordable
{
    use \Altek\Accountant\Recordable;
}