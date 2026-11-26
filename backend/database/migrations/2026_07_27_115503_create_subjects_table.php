<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSubjectsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('subjects', function (Blueprint $table) {

            $table->bigIncrements('id');

            // Subject Name
            $table->string('subject_name', 100);

            // Subject Code
            $table->string('subject_code', 20)->unique();

            // Theory / Practical / Both
            $table->enum('subject_type', ['Theory', 'Practical', 'Both'])
                  ->default('Theory');

            // Optional Description
            $table->text('description')->nullable();

            // Display Order
            $table->unsignedInteger('display_order')->default(1);

            // Active / Inactive
            $table->boolean('status')->default(true);

            // Created By
            $table->unsignedBigInteger('created_by')->nullable();

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
        Schema::dropIfExists('subjects');
    }
}