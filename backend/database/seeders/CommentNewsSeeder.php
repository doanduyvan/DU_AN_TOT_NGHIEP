<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CommentNews;

class CommentNewsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        CommentNews::factory()->count(30)->create();
    }
}
