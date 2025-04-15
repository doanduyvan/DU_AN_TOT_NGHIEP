<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\CategoryNews;
use Illuminate\Database\Eloquent\Factories\Factory;
use Faker\Generator as Faker;

class CategoryNewsFactory extends Factory
{
    protected $model = CategoryNews::class;

    public function definition()
    {
        return [
            'img' => $this->faker->imageUrl(640, 480, 'business', true),
            'category_news_name' => $this->faker->word(),
            'created_at' => now(),
            'updated_at' => now(),
            'deleted_at' => null,
        ];
    }
}
