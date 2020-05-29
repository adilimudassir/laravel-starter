<?php

use App\Domain\Auth\Models\Auth\Role;
use Illuminate\Database\Seeder;

class PermissionRoleTableSeeder extends Seeder
{
    use DisableForeignKeys, CreatePermissions;
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->disableForeignKeys();

        // Create Roles
        collect([
            'admin',
            'user'
        ])->each(function ($role) {
            Role::firstOrCreate(['name' => $role]);
        });

        $this->generatePermissions();

        $this->enableForeignKeys();

    }
}
