<?php
namespace Domains\Auth\Repositories;

use Domains\Auth\Models\User;
use Illuminate\Support\Facades\DB;
use App\Repositories\BaseRepository;
use Illuminate\Support\Facades\Hash;

class UserRepository extends BaseRepository
{
    /**
     * create an instance of the class
     *
     * @param User $user
     */
    public function __construct(User $user)
    {
        $this->model = $user;
    }

    public function create(array $data = []) : User
    {
        return DB::transaction(function () use ($data) {
            return $this->model::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password'])
            ]);
        });
    }
}
