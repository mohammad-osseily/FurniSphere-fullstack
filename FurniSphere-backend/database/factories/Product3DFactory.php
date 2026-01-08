<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Product3D;
use Illuminate\Database\Eloquent\Factories\Factory;

class Product3DFactory extends Factory
{
    protected $model = Product3D::class;

    public function definition(): array
    {
        $product = Product::inRandomOrder()->first();

        return [
            'product_id' => $product->id,  // Assigning a random product
            'model_file_path' => $this->faker->filePath(),
            'file_type' => $this->faker->randomElement(['gltf', 'obj', 'fbx']),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
