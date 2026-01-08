<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->words(3, true), // Generates a random product name
            'description' => $this->faker->sentence,
            'price' => $this->faker->randomFloat(2, 10, 1000),
            'category_id' => Category::inRandomOrder()->first()->id,  // Assigns a random category
            'stock' => $this->faker->numberBetween(1, 100),
            'image' => $this->faker->word,  // Generates a random image name
            'color' => $this->faker->safeColorName(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
