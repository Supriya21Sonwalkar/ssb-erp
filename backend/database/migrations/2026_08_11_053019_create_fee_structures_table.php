<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFeeStructuresTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('fee_structures', function (Blueprint $table) {

            $table->bigIncrements('id');

            /*
            |--------------------------------------------------------------------------
            | Fee Component
            |--------------------------------------------------------------------------
            | Determines whether this is:
            | Course Fee
            | Hostel Fee
            | Other Fee
            */

            $table->unsignedBigInteger('fee_component_id');


            /*
            |--------------------------------------------------------------------------
            | Course
            |--------------------------------------------------------------------------
            | Required when component_type = course.
            | NULL for Hostel / Other components.
            */

            $table->unsignedBigInteger('course_id')->nullable();


            /*
            |--------------------------------------------------------------------------
            | Academic Year
            |--------------------------------------------------------------------------
            */

            $table->unsignedBigInteger('academic_year_id');


            /*
            |--------------------------------------------------------------------------
            | Structure Details
            |--------------------------------------------------------------------------
            */

            $table->string('name', 255);

            $table->decimal('total_amount', 12, 2)->default(0);

            $table->date('effective_from')->nullable();

            $table->date('effective_to')->nullable();

            $table->boolean('status')->default(true);

            $table->text('remarks')->nullable();


            /*
            |--------------------------------------------------------------------------
            | Audit
            |--------------------------------------------------------------------------
            */

            $table->unsignedBigInteger('created_by')->nullable();

            $table->unsignedBigInteger('updated_by')->nullable();

            $table->timestamps();


            /*
            |--------------------------------------------------------------------------
            | Indexes
            |--------------------------------------------------------------------------
            */

            $table->index('fee_component_id');

            $table->index('course_id');

            $table->index('academic_year_id');

            $table->index('status');


            /*
            |--------------------------------------------------------------------------
            | One structure per course/component/academic year
            |--------------------------------------------------------------------------
            */

            $table->unique(
                [
                    'fee_component_id',
                    'course_id',
                    'academic_year_id'
                ],
                'fee_structure_component_course_year_unique'
            );

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('fee_structures');
    }
}