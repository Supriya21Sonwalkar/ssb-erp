<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFeeStructureItemsTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('fee_structure_items', function (Blueprint $table) {

            $table->bigIncrements('id');

            /*
            |--------------------------------------------------------------------------
            | Parent Fee Structure
            |--------------------------------------------------------------------------
            */

            $table->unsignedBigInteger('fee_structure_id');


            /*
            |--------------------------------------------------------------------------
            | Fee Head
            |--------------------------------------------------------------------------
            | Example:
            | Tuition Fee
            | NDA Preparation
            | SSB Training
            | Hostel
            | Food
            */

            $table->string('fee_head', 150);

            $table->text('description')->nullable();

            $table->decimal('amount', 12, 2)->default(0);

            $table->integer('order_number')->default(0);

            $table->timestamps();


            /*
            |--------------------------------------------------------------------------
            | Indexes
            |--------------------------------------------------------------------------
            */

            $table->index('fee_structure_id');

            $table->index('order_number');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('fee_structure_items');
    }
}