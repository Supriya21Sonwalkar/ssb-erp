<?php

 

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\HomepageMedia;

class HomepageMediaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        HomepageMedia::create([
            'title' => 'Main Hero Cinematic',
            'video_path' => 'storage/new/Video1.mp4',
            'modal_video_path' => 'storage/new/Video1.mp4',
            'is_active' => true,
        ]);
    }
}
