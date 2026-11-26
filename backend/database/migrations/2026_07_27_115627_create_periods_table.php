<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePeriodsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('periods', function (Blueprint $table) {

            $table->bigIncrements('id');

            // Period Name
            $table->string('period_name', 100);

            // Period Number
            $table->unsignedInteger('period_no');

            // Time
            $table->time('start_time');
            $table->time('end_time');

            // Break Period?
            $table->boolean('is_break')->default(false);

            // Status
            $table->boolean('status')->default(true);

            // Created By
            $table->unsignedBigInteger('created_by')->nullable();

            $table->timestamps();

            $table->unique('period_no');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('periods');
    }
}