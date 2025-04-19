<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Faker\Generator as Faker;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition()
    {
        return [
            'product_name' => $this->faker->word(),
            'avatar' => $this->faker->imageUrl(640, 480, 'product', true),
            'description' => $this->faker->paragraph(),
            'category_id' => Category::inRandomOrder()->first()->id,
            'user_id' => User::inRandomOrder()->first()->id,
            'created_at' => now(),
            'updated_at' => now(),
            'deleted_at' => null,
            'status' => $this->faker->boolean(),
            'rating_avg' => $this->faker->randomFloat(1, 1, 5),
            'total_reviews' => $this->faker->numberBetween(0, 200),
        ];
    }

    /**
     * Define the model's default state.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function configure()
    {
        return $this->afterCreating(function (Product $product) {
            $product->variants()->create([
                'size' => $this->faker->randomElement(['S', 'M', 'L', 'XL']),
                'price' => $this->faker->randomFloat(2, 10, 100),
                'promotional_price' => $this->faker->randomFloat(2, 5, 90),
                'stock_quantity' => $this->faker->numberBetween(0, 100),
                'sku' => $this->faker->unique()->word(),
                'product_id' => $product->id,
                'sold_quantity' => $this->faker->numberBetween(0, 50),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        });
    }
}
