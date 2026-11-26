<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAssetsTable extends Migration
{
    public function up()
    {
        Schema::create('assets', function (Blueprint $table) {
            $table->bigIncrements('id');

            $table->unsignedBigInteger('category_id');
            $table->unsignedBigInteger('subcategory_id');

            $table->string('asset_name', 200);
            $table->string('asset_code', 100)->unique();

            $table->text('description')->nullable();

            $table->tinyInteger('status')
                ->default(1)
                ->comment('1 = Active, 0 = Inactive');

            $table->timestamps();

            $table->foreign('category_id')
                ->references('id')
                ->on('asset_categories')
                ->onDelete('restrict');

            $table->foreign('subcategory_id')
                ->references('id')
                ->on('asset_subcategories')
                ->onDelete('restrict');
        });
    }

    public function down()
    {
        Schema::dropIfExists('assets');
    }
}