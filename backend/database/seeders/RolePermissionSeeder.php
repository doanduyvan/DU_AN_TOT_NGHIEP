<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Tạo roles
        $adminRole = Role::firstOrCreate(['name' => 'Admin', 'guard_name' => 'api']);
        $userRole = Role::firstOrCreate(['name' => 'Users', 'guard_name' => 'api']);

        // Tạo user admin đầu tiên
        $admin = User::firstOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'fullname' => 'Duy Van',
                'password' => Hash::make('123456'),
                'status' => 1,
                'is_verify' => 1,
            ]
        );
        $admin->assignRole($adminRole);

        // Nhập mảng permission tại đây:
        $permissions = [
            'create-product',
            'update-product',
            'delete-product',
            'update-customer',
            'delete-customer',
            'create-category',
            'update-category',
            'delete-category',
            'create-role',
            'update-role',
            'delete-role',
            'create-permission',
            'update-permission',
            'delete-permission',
            'create-category-news',
            'update-category-news',
            'delete-category-news',
            'create-news',
            'update-news',
            'delete-news'
        ];

        $permissions2 = [
            'create-role',
            'update-role',
            'delete-role',
            'create-permission',
            'update-permission',
            'delete-customer',
            'update-customer',
            'create-category',
            'delete-category',
            'update-category',
            'create-category-news',
            'delete-category-news',
            'update-category-news',
            'create-product',
            'delete-product',
            'update-product',
            'update-news',
            'create-news',
            'delete-news'
        ];

        // Tạo permission và gán cho Admin
        foreach ($permissions2 as $permission) {
            $perm = Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'api'
            ]);
            $perm->assignRole($adminRole);
        }

        // Users không cần permission mặc định
    }
}
