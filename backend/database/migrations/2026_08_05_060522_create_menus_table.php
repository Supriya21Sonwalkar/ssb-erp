<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMenusTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('menus', function (Blueprint $table) {

            $table->bigIncrements('id');

            /*
            |--------------------------------------------------------------------------
            | Module
            |--------------------------------------------------------------------------
            */
            $table->unsignedBigInteger('module_id');

            /*
            |--------------------------------------------------------------------------
            | Parent Menu
            |--------------------------------------------------------------------------
            | NULL = Main Menu
            | Value = Submenu
            */
            $table->unsignedBigInteger('parent_id')->nullable();

            /*
            |--------------------------------------------------------------------------
            | Menu Details
            |--------------------------------------------------------------------------
            */
            $table->string('menu_name');
            $table->string('menu_slug')->unique();

            $table->string('route')->nullable();

            $table->string('icon')->nullable();

            /*
            |--------------------------------------------------------------------------
            | Navigation
            |--------------------------------------------------------------------------
            */
            $table->integer('display_order')->default(0);

            /*
            |--------------------------------------------------------------------------
            | If false -> only expandable (folder/group)
            | If true  -> clickable page
            |--------------------------------------------------------------------------
            */
            $table->boolean('is_clickable')->default(true);

            /*
            |--------------------------------------------------------------------------
            | Status
            |--------------------------------------------------------------------------
            */
            $table->boolean('status')->default(true);

            $table->timestamps();

            /*
            |--------------------------------------------------------------------------
            | Foreign Keys
            |--------------------------------------------------------------------------
            */

            $table->foreign('module_id')
                  ->references('id')
                  ->on('modules')
                  ->onDelete('cascade');

            $table->foreign('parent_id')
                  ->references('id')
                  ->on('menus')
                  ->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('menus');
    }
}