<?php

 

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Testimonial;

class TestimonialSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $testimonials = [
            [
                'cadet_name' => 'Akshay Tyagi',
                'entry_type' => 'NDA Recommended',
                'batch_year' => '2023-24',
                'quote' => 'Aaryans Defence Academy was the turning point in my preparation. The GTO ground practice and psychological tests prepared me for the real challenges at SSB.',
                'photo_path' => 'storage/new/Akshay Tyagi.jpeg',
                'is_featured' => true,
                'order_number' => 1,
            ],
            [
                'cadet_name' => 'Abhay Pratap Singh',
                'entry_type' => 'SSB Recommended',
                'batch_year' => '2024',
                'quote' => 'The mentorship by retired officers is what sets this academy apart. The routine and discipline helped me clear my recommendation with confidence.',
                'photo_path' => 'storage/new/Abhay Pratap Singh.jpeg',
                'is_featured' => true,
                'order_number' => 2,
            ],
            [
                'cadet_name' => 'Shalu Yadav',
                'entry_type' => 'AFCAT Recommended',
                'batch_year' => '2023',
                'quote' => 'The residential environment provided the focus I needed. The daily routine balanced academics and physical training perfectly.',
                'photo_path' => 'storage/new/Shalu Yadav.jpeg',
                'is_featured' => true,
                'order_number' => 3,
            ],
        ];

        foreach ($testimonials as $testimonial) {
            Testimonial::updateOrCreate(
                ['cadet_name' => $testimonial['cadet_name']],
                $testimonial
            );
        }
    }
}
