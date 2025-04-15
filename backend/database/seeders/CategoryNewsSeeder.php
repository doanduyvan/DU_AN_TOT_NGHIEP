<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CategoryNews;

class CategoryNewsSeeder extends Seeder
{
    public function run()
    {
        CategoryNews::factory()->count(10)->create();
    }
}
