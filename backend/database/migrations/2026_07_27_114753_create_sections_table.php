<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSectionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sections', function (Blueprint $table) {

            $table->bigIncrements('id');

            $table->unsignedBigInteger('class_id');

            $table->string('section_name', 20);

            $table->string('room_number')->nullable();

            $table->integer('capacity')->nullable();

            $table->boolean('status')->default(true);

            $table->timestamps();

            $table->foreign('class_id')
                ->references('id')
                ->on('classes')
                ->onDelete('cascade');

            $table->unique(['class_id', 'section_name']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sections');
    }
}