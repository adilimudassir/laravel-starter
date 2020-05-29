<?php

namespace App\Domain\Auth\Models\Auth;

use Spatie\Permission\Traits\HasRoles;
use Illuminate\Notifications\Notifiable;
use Altek\Accountant\Contracts\Recordable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable implements Recordable
{
    use Notifiable, HasRoles, \Altek\Accountant\Recordable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
}
