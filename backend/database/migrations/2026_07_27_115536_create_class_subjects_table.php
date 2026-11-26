<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClassSubjectsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('class_subjects', function (Blueprint $table) {

            $table->bigIncrements('id');

            // Class
            $table->unsignedBigInteger('class_id');

            // Subject
            $table->unsignedBigInteger('subject_id');

            // Is this a compulsory subject?
            $table->boolean('is_compulsory')->default(true);

            // Display Order
            $table->unsignedInteger('display_order')->default(1);

            // Status
            $table->boolean('status')->default(true);

            // Created By
            $table->unsignedBigInteger('created_by')->nullable();

            $table->timestamps();

            // Foreign Keys
            $table->foreign('class_id')
                ->references('id')
                ->on('classes')
                ->onDelete('cascade');

            $table->foreign('subject_id')
                ->references('id')
                ->on('subjects')
                ->onDelete('cascade');

            // Prevent duplicate subject allocation
            $table->unique(['class_id', 'subject_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('class_subjects');
    }
}