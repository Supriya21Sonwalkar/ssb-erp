<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFeePaymentsTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('fee_payments', function (Blueprint $table) {

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
            | Receipt
            |--------------------------------------------------------------------------
            */

            $table->string('receipt_no', 50)->unique();

            $table->date('payment_date');


            /*
            |--------------------------------------------------------------------------
            | Payment Amount
            |--------------------------------------------------------------------------
            */

            $table->decimal('amount', 12, 2);


            /*
            |--------------------------------------------------------------------------
            | Payment Mode
            |--------------------------------------------------------------------------
            |
            | Cash
            | UPI
            | Bank Transfer
            | Cheque
            | Card
            | Online
            |
            */

            $table->string('payment_mode', 30);


            /*
            |--------------------------------------------------------------------------
            | Transaction Details
            |--------------------------------------------------------------------------
            */

            $table->string(
                'transaction_reference',
                255
            )->nullable();

            $table->string(
                'cheque_no',
                100
            )->nullable();

            $table->string(
                'bank_name',
                255
            )->nullable();


            /*
            |--------------------------------------------------------------------------
            | Remarks
            |--------------------------------------------------------------------------
            */

            $table->text('remarks')->nullable();


            /*
            |--------------------------------------------------------------------------
            | Payment Status
            |--------------------------------------------------------------------------
            */

            $table->string(
                'status',
                20
            )->default('Success');


            /*
            |--------------------------------------------------------------------------
            | Received By
            |--------------------------------------------------------------------------
            */

            $table->unsignedBigInteger(
                'received_by'
            )->nullable();


            /*
            |--------------------------------------------------------------------------
            | Timestamps
            |--------------------------------------------------------------------------
            */

            $table->timestamps();


            /*
            |--------------------------------------------------------------------------
            | Indexes
            |--------------------------------------------------------------------------
            */

            $table->index('student_id');

            $table->index('course_id');

            $table->index('fee_structure_id');

            $table->index('payment_date');

            $table->index('payment_mode');

            $table->index('status');

            $table->index('received_by');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('fee_payments');
    }
}