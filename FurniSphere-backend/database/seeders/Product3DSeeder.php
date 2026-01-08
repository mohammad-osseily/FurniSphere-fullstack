<?php

// database/seeders/ProductSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class Product3DSeeder extends Seeder
{
    public function run()
    {
        Product::factory()->count(5)->create();
    }
}
