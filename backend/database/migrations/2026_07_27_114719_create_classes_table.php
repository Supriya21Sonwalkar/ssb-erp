<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClassesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('classes', function (Blueprint $table) {

            $table->bigIncrements('id');

            // Example: Grade 1, LKG, UKG
            $table->string('class_name', 100);

            // Short code
            $table->string('class_code', 20)->nullable();

            // Display order in dropdowns
            $table->integer('display_order')->default(1);

            // Maximum students allowed
            $table->integer('capacity')->nullable();

            // Active / Inactive
            $table->boolean('status')->default(true);

            // Created By
            $table->unsignedBigInteger('created_by')->nullable();

            $table->timestamps();

            $table->unique('class_name');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('classes');
    }
}