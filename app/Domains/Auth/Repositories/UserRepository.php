<?php

namespace Domains\Auth\Repositories;

use Domains\Auth\Models\User;
use Illuminate\Support\Facades\DB;
use App\Exceptions\GeneralException;
use App\Repositories\BaseRepository;
use Domains\Auth\Events\UserCreated;
use Domains\Auth\Events\UserUpdated;
use Illuminate\Support\Facades\Hash;
use Backend\Http\Requests\UserFormRequest;
use Domains\Auth\Exceptions\UserException;
use Domains\Auth\Exceptions\CreateUserException;

class UserRepository extends BaseRepository
{
    /**
     * create an instance of the class.
     *
     * @param User $user
     */
    public function __construct(User $user)
    {
        $this->model = $user;
    }

    public function create(UserFormRequest $request): User
    {
        return DB::transaction(function () use ($request) {
            $newUser = $this->model::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'active' => $request->has('status') ? 1 : 0,
                'email_verified_at' => $request->has('confirmed') ? now() : null
            ]);

            if (!$newUser) {
                throw new UserException("Account could not be created at the moment");
            }

            if ($request->has('roles')) {
                $newUser->assignRole($request->roles);
            } else {
                $newUser->assignRole(config('access.default_role'));
            }

            event(new UserCreated($newUser));

            return $newUser;
        });
    }

    public function update(UserFormRequest $request, User $user): User
    {
        return DB::transaction(function () use ($request, $user) {
            if (!$user->update([
                'name' => $request->name,
                'email' => $request->email,
                'active' => $request->has('status') ? 1 : 0,
                'email_verified_at' => $request->has('confirmed') ? now() : null
            ])) {
                throw new UserException("User Could not be updated");
            }

            if ($request->has('roles')) {
                $user->syncRoles($request->roles);
            } else {
                $user->syncRoles(config('access.default_role'));
            }

            event(new UserUpdated($user));

            return $user;
        });
    }

    /**
    * @param  Int  $id
    *
    * @return User
    * @throws GeneralException
    */
    public function delete($id): User
    {
        $user = $this->getById($id);
        
        if ($user->id === 1) {
            throw new GeneralException(__('You can not delete the administrator account.'));
        }

        if ($user->id === auth()->id()) {
            throw new GeneralException(__('You can not delete yourself.'));
        }

        if ($user->deleted_at !== null) {
            throw new GeneralException(__('This user is already deleted.'));
        }

        if ($this->deleteById($user->id)) {
            return $user;
        }

        throw new GeneralException('There was a problem deleting this user. Please try again.');
    }
}
