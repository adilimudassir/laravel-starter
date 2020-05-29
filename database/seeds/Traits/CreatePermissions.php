<?php

use App\Domain\Auth\Models\Auth\Role;
use Spatie\Permission\Models\Permission;

trait CreatePermissions
{

    protected $permissions = [
        'create',
        'read',
        'update',
        'delete',
        'forceDelete',
        'restore',
        [
            '*' => [
                'view backend',
                'manage hospital',
                'issue-pharmacy-drugs',
                'issue-maternity-drugs',
                'issue-male-ward-drugs'
            ],
            'admissions' => [
                'discharge'
            ]
        ]
    ];

    protected $entities = [
        'users',
        'roles',
        'logs',
        'patients',
        'services',
        'drugs',
        'invoices',
        'payments',
        'appointments',
        'beds',
        'admissions',
        'hmos',
        'laboratories',
        'tests',
        'investigations',
        'drug_stores',
        'drug_quantities',
        'prescriptions',
        'diagnoses'
    ];

    public function generatePermissions()
    {
        foreach ($this->entities as $entity) {
            foreach ($this->permissions as $permission) {
                is_array($permission) ?
                    $this->createPermissionsFromArray($permission, $entity) :
                    $this->createPermissionWithEntity($permission, $entity);
            }
        }
    }

    private function assignRoleToPermission($permission)
    {
        $role = Role::findByName(config('access.users.admin_role'));
        $role->givePermissionTo($permission);
    }

    private function createPermissionWithEntity($permission, $entity)
    {
        $this->assignRoleToPermission(Permission::firstOrCreate([
            'name' => $permission . "-" . $entity
        ]));
    }

    private function createPermissionWithoutEntity($permission)
    {
        $this->assignRoleToPermission(Permission::firstOrCreate([
            'name' => $permission
        ]));
    }

    private function createPermissionsFromArray($array, $entity)
    {
        foreach ($array as $key => $value) {
            if ($key == $entity) {
                foreach ($value as $permission) {
                    $this->createPermissionWithEntity($permission, $entity);
                }
            }
            if ($key !== $entity) {
                foreach ($value as $permission) {
                    $this->createPermissionWithoutEntity($permission);
                }
            }
        }
    }
}
