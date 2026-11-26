<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTestimonialsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()            
    {
        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->string('cadet_name');
            $table->string('entry_type');
            $table->string('batch_year');
            $table->text('quote');
            $table->string('photo_path')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->integer('order_number')->default(0);
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
        Schema::dropIfExists('testimonials');
    }
}   
