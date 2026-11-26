<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateHomepageMediaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()    
    {
        Schema::create('homepage_media', function (Blueprint $table) {
            $table->id();
            $table->string('title')->nullable();
            $table->string('video_path')->comment('Hero background video');
            $table->string('modal_video_path')->nullable()->comment('Video that plays in modal');
            $table->string('thumbnail_path')->nullable()->comment('Fallback image');
            $table->boolean('is_active')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void     
     */
    public function down()
    {
        Schema::dropIfExists('homepage_media');
    }
}   
// CreateHomepageMediaTable.php     
