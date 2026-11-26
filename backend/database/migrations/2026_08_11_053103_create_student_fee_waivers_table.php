<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStudentFeeWaiversTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('student_fee_waivers', function (Blueprint $table) {

            $table->bigIncrements('id');


            /*
            |--------------------------------------------------------------------------
            | Student
            |--------------------------------------------------------------------------
            */

            $table->unsignedBigInteger('student_id');


            /*
            |--------------------------------------------------------------------------
            | Course
            |--------------------------------------------------------------------------
            */

            $table->unsignedBigInteger('course_id');


            /*
            |--------------------------------------------------------------------------
            | Fee Structure
            |--------------------------------------------------------------------------
            */

            $table->unsignedBigInteger('fee_structure_id');


            /*
            |--------------------------------------------------------------------------
            | Waiver
            |--------------------------------------------------------------------------
            |
            | fixed
            | percentage
            |
            */

            $table->string('waiver_type', 20);

            /*
            | If percentage:
            | 10 = 10%
            |
            | If fixed:
            | 10000 = ₹10,000
            */

            $table->decimal('waiver_value', 12, 2)->default(0);


            /*
            |--------------------------------------------------------------------------
            | Actual calculated waiver amount
            |--------------------------------------------------------------------------
            */

            $table->decimal('waiver_amount', 12, 2)->default(0);


            /*
            |--------------------------------------------------------------------------
            | Reason
            |--------------------------------------------------------------------------
            */

            $table->text('reason');


            /*
            |--------------------------------------------------------------------------
            | Status
            |--------------------------------------------------------------------------
            */

            $table->boolean('status')->default(true);


            /*
            |--------------------------------------------------------------------------
            | Approval
            |--------------------------------------------------------------------------
            */

            $table->unsignedBigInteger('approved_by')->nullable();

            $table->dateTime('approved_at')->nullable();


            /*
            |--------------------------------------------------------------------------
            | Remarks
            |--------------------------------------------------------------------------
            */

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

            $table->index('student_id');

            $table->index('course_id');

            $table->index('fee_structure_id');

            $table->index('status');

            $table->index('approved_by');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('student_fee_waivers');
    }
}