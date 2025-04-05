<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $categories = ['Khuyến mãi', 'Tin công nghệ', 'Hướng dẫn', 'Sự kiện', 'Cảnh báo mỹ phẩm', 'Thông báo'];

        foreach ($categories as $name) {
            DB::table('category_news')->insert([
                'category_news_name' => $name,
                'img' => 'category_' . Str::slug($name) . '.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $images = [];
        for ($i = 1; $i <= 20; $i++) {
            $images[] = "hinh{$i}.jpg";
        }

        for ($i = 1; $i <= 25; $i++) {
            DB::table('news')->insert([
                'avatar' => $images[array_rand($images)],
                'title' => 'Bài viết số ' . $i,
                'content' => 'Nội dung mô tả chi tiết cho bài viết số ' . $i,
                'user_id' => 1,
                'category_news_id' => rand(1, 6),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }


}
