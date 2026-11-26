<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAssetCategoriesTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('asset_categories', function (Blueprint $table) {

            $table->bigIncrements('id');

            $table->string('category_name', 150);

            $table->string('category_code', 50)
                ->unique();

            $table->text('description')
                ->nullable();

            $table->tinyInteger('status')
                ->default(1)
                ->comment('1 = Active, 0 = Inactive');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('asset_categories');
    }
}