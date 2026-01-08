<?php

// database/seeders/ProductSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;

class ProductSeeder extends Seeder
{
    public function run()
    {
        // Get the four specific categories
        $featured3DCategory = Category::where('name', 'Featured 3D Products')->first();
        $chairCategory = Category::where('name', 'Chair')->first();
        $sofaCategory = Category::where('name', 'Sofa')->first();
        $tableCategory = Category::where('name', 'Table')->first();

        // Featured 3D Products
        Product::insert([
            [
                'name' => '3D Printed Modern Lamp',
                'description' => 'A unique 3D printed lamp that adds a modern touch to your home decor.',
                'price' => 79.99,
                'stock' => 12,
                'category_id' => $featured3DCategory->id,
                'image' => '3dObject1',
                'color' => 'White',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => '3D Sculpted Wall Art',
                'description' => 'This 3D sculpted wall art features intricate geometric designs for modern homes.',
                'price' => 149.99,
                'stock' => 8,
                'category_id' => $featured3DCategory->id,
                'image' => '3dObject2',
                'color' => 'Silver',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => '3D Geometric Coffee Table',
                'description' => 'A stylish coffee table made using 3D printing technology for an edgy look.',
                'price' => 299.99,
                'stock' => 5,
                'category_id' => $featured3DCategory->id,
                'image' => '3dObject3',
                'color' => 'Black',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => '3D Printed Vase',
                'description' => 'A stunning vase crafted using 3D technology, perfect for modern interiors.',
                'price' => 49.99,
                'stock' => 15,
                'category_id' => $featured3DCategory->id,
                'image' => '3dObject4',
                'color' => 'Blue',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => '3D Hexagonal Shelf',
                'description' => 'A modern wall shelf designed with a 3D hexagonal pattern.',
                'price' => 89.99,
                'stock' => 10,
                'category_id' => $featured3DCategory->id,
                'image' => '3dObject5`',
                'color' => 'Gray',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // Chair Category
        Product::insert([
            [
                'name' => 'Kitchen Chair',
                'description' => 'An ergonomic chair designed for maximum comfort and lumbar support.',
                'price' => 199.99,
                'stock' => 25,
                'category_id' => $chairCategory->id,
                'image' => 'chair',
                'color' => 'Black',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Dress up Chair',
                'description' => 'A classic Dress up chair perfect for your comfort while getting dressed.',
                'price' => 89.99,
                'stock' => 30,
                'category_id' => $chairCategory->id,
                'image' => 'chair2',
                'color' => 'white',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Office Chair',
                'description' => 'A modern offic chair designed for both indoor and outdoor use.',
                'price' => 59.99,
                'stock' => 50,
                'category_id' => $chairCategory->id,
                'image' => 'chair3',
                'color' => 'beige',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Salon Chair',
                'description' => 'A  rocking Salon chair designed for your guestes.',
                'price' => 39.99,
                'stock' => 20,
                'category_id' => $chairCategory->id,
                'image' => 'chair4',
                'color' => 'green',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Outdoor Lounge Chair',
                'description' => 'A durable outdoor lounge chair for relaxing in the garden or by the pool.',
                'price' => 149.99,
                'stock' => 40,
                'category_id' => $chairCategory->id,
                'image' => 'chair5',
                'color' => 'Gray',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // Sofa Category
        Product::insert([
            [
                'name' => 'Leather Sectional Sofa',
                'description' => 'A luxurious sectional sofa made from premium leather.',
                'price' => 999.99,
                'stock' => 8,
                'category_id' => $sofaCategory->id,
                'image' => 'greensofa',
                'color' => 'green',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Fabric Recliner Sofa',
                'description' => 'A comfortable recliner sofa perfect for family movie nights.',
                'price' => 799.99,
                'stock' => 10,
                'category_id' => $sofaCategory->id,
                'image' => 'sofa',
                'color' => 'brown',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Convertible Sofa Bed',
                'description' => 'A sofa that easily converts into a bed for overnight guests.',
                'price' => 599.99,
                'stock' => 12,
                'category_id' => $sofaCategory->id,
                'image' => 'sofa1',
                'color' => 'orange',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Vintage Velvet Sofa',
                'description' => 'A beautiful velvet sofa with a vintage design.',
                'price' => 699.99,
                'stock' => 6,
                'category_id' => $sofaCategory->id,
                'image' => 'sofa4',
                'color' => 'yellow',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Compact Sofa',
                'description' => 'A compact sofa perfect for small spaces or apartments.',
                'price' => 499.99,
                'stock' => 20,
                'category_id' => $sofaCategory->id,
                'image' => 'sofa3',
                'color' => 'Grey',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // Table Category
        Product::insert([
            [
                'name' => 'White Table',
                'description' => 'A sleek dining table with a white sheet on top.',
                'price' => 599.99,
                'stock' => 10,
                'category_id' => $tableCategory->id,
                'image' => 'table',
                'color' => 'white',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Orange Table',
                'description' => 'A traditional wooden coffee table with carved legs.',
                'price' => 249.99,
                'stock' => 15,
                'category_id' => $tableCategory->id,
                'image' => 'table2',
                'color' => 'orange',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Dark Table',
                'description' => 'A minimalist side table, perfect for small spaces.',
                'price' => 149.99,
                'stock' => 20,
                'category_id' => $tableCategory->id,
                'image' => 'table3',
                'color' => 'Dark blue',
                'created_at' => now(),
                'updated_at' => now(),
            ],


        ]);
    }
}
