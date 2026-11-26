<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateResourcesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()                    
    {
        Schema::create('resources', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->enum('category', ['nda_syllabus', 'ssb_prep', 'previous_papers', 'current_affairs']);
            $table->string('file_path')->nullable();
            $table->boolean('is_new')->default(false);
            $table->integer('download_count')->default(0);
            $table->boolean('is_active')->default(true);
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
        Schema::dropIfExists('resources');
    }
}   
// CreateResourcesTable.php 
