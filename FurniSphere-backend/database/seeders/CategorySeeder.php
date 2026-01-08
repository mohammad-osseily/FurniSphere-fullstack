<?php

// database/seeders/CategorySeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run()
    {
        $categories = [
            ['name' => 'Featured 3D Products', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Chair', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Sofa', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Table', 'created_at' => now(), 'updated_at' => now()],
        ];

        Category::insert($categories);
    }
}
