<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\CommentNews;
use Faker\Generator as Faker;
use App\Models\User;
use App\Models\News;

class CommentNewsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'content' => $this->faker->text(200),
            'user_id' => User::inRandomOrder()->first()->id,
            'news_id' => News::inRandomOrder()->first()->id,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
