<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAcademicYearsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('academic_years', function (Blueprint $table) {

            $table->bigIncrements('id');

            // Example: 2025-2026
            $table->string('academic_year', 20)->unique();

            $table->date('start_date');
            $table->date('end_date');

            // Only one academic year should be current
            $table->boolean('is_current')->default(false);

            // Active / Inactive
            $table->boolean('status')->default(true);

            // Optional: Track who created the record
            $table->unsignedBigInteger('created_by')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('academic_years');
    }
}