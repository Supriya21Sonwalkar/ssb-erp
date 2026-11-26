<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateModulesTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('modules', function (Blueprint $table) {

            $table->bigIncrements('id');

            $table->string('module_name');
            $table->string('module_slug')->unique();

            $table->string('module_icon')->nullable();
            $table->text('description')->nullable();

            $table->integer('display_order')->default(0);

            $table->boolean('status')->default(1);

            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('modules');
    }
}