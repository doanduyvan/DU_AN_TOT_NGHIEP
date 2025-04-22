<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CommentProduct;

class CommentProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        CommentProduct::factory()->count(30)->create();
    }
}
