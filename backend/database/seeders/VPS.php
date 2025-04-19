<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VPS extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->call(RolePermissionSeeder::class);
        $path = base_path('database/sql/tinhthanh.sql');
        $sql = file_get_contents($path);
        DB::unprepared($sql);
    }
}
