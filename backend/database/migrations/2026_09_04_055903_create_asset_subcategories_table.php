<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAssetSubcategoriesTable extends Migration
{
    public function up()
    {
        Schema::create('asset_subcategories', function (Blueprint $table) {

            $table->bigIncrements('id');

            $table->unsignedBigInteger('category_id');

            $table->string('subcategory_name', 150);

            $table->string('subcategory_code', 50);

            $table->text('description')->nullable();

            $table->tinyInteger('status')
                ->default(1)
                ->comment('1 = Active, 0 = Inactive');

            $table->timestamps();

            $table->foreign('category_id')
                ->references('id')
                ->on('asset_categories')
                ->onDelete('restrict');

            $table->unique(
                ['category_id', 'subcategory_code'],
                'asset_subcategory_category_code_unique'
            );
        });
    }

    public function down()
    {
        Schema::dropIfExists('asset_subcategories');
    }
}