<?php

 

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GalleryCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $categories = [
            ['name' => 'PT & Fitness', 'slug' => 'pt_fitness', 'order_number' => 1],
            ['name' => 'GTO Ground', 'slug' => 'gto_ground', 'order_number' => 2],
            ['name' => 'Academics', 'slug' => 'academics', 'order_number' => 3],
            ['name' => 'Recommended', 'slug' => 'recommended', 'order_number' => 4],
        ];

        foreach ($categories as $category) {
            \App\Models\GalleryCategory::updateOrCreate(['slug' => $category['slug']], $category);
        }
    }
}
