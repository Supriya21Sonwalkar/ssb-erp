<?php

 

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\GalleryItem;
use App\Models\GalleryCategory;

class GallerySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        GalleryItem::truncate();    

        $excludedFiles = [
            'Gemini_Generated_Image_3s957z3s957z3s95.png',
            'milind_ladge.jpeg',
            'arpit_chaudhary.jpeg',
            'kartikey_chaudhary.jpeg',
            'pratik_ladge.jpeg',
            'pranav_ladge.jpeg',
            'SSB Logo.png',
        ];

        $storagePath = public_path('storage/new');
        if (!file_exists($storagePath)) {
            return;
        }

        $files = scandir($storagePath);
        $categories = GalleryCategory::all();

        if ($categories->isEmpty()) {
            $this->command->warn('No gallery categories found. Please seed GalleryCategory first.');
            return;
        }

        $count = 0;

        foreach ($files as $file) {
            if (in_array($file, ['.', '..']) || in_array($file, $excludedFiles) || str_starts_with($file, 'Gemini_Generated_Image')) {
                continue;
            }

            $extension = pathinfo($file, PATHINFO_EXTENSION);
            if (in_array(strtolower($extension), ['jpg', 'jpeg', 'png', 'webp'])) {
                $category = $categories[$count % $categories->count()];
                
                GalleryItem::create([
                    'title' => ucwords(str_replace(['-', '_', '.'], ' ', pathinfo($file, PATHINFO_FILENAME))),
                    'gallery_category_id' => $category->id,
                    'category' => $category->slug,
                    'image_path' => 'storage/new/' . $file,
                    'is_featured' => ($count < 6),
                    'is_active' => true,
                    'order_number' => $count,
                ]);
                $count++;
            }
        }
    }
}
