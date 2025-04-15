<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        // $adminRole = Role::firstOrCreate(['name' => 'Admin']);

        // $user = User::create([
        //     'name' => 'Admin User',
        //     'email' => 'admin@gmail.com',
        //     'password' => Hash::make('123123'),
        // ]);

        // $user->assignRole($adminRole);
        User::factory()->count(20)->create();

    }
}
