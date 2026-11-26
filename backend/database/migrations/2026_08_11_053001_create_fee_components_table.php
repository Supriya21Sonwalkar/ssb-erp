<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFeeComponentsTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('fee_components', function (Blueprint $table) {

            $table->bigIncrements('id');

            // Example: Course Fee, Hostel Fee, Transport Fee
            $table->string('name', 100);

            // Example: COURSE, HOSTEL, TRANSPORT
            $table->string('code', 50)->unique();

            // course / hostel / other
            $table->string('component_type', 30);

            $table->boolean('is_active')->default(true);

            $table->text('remarks')->nullable();

            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();

            $table->timestamps();

            $table->index('component_type');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('fee_components');
    }
}