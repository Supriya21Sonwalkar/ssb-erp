<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTeacherAllocationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('teacher_allocations', function (Blueprint $table) {

            $table->bigIncrements('id');

            $table->unsignedBigInteger('academic_year_id');

            $table->unsignedBigInteger('class_id');

            $table->unsignedBigInteger('subject_id');

            $table->unsignedBigInteger('employee_id');

            $table->boolean('status')->default(1);

            $table->unsignedBigInteger('created_by')->nullable();

            $table->unsignedBigInteger('updated_by')->nullable();

            $table->timestamps();

            // Foreign Keys

            $table->foreign('academic_year_id')
                ->references('id')
                ->on('academic_years')
                ->onDelete('cascade');

            $table->foreign('class_id')
                ->references('id')
                ->on('classes')
                ->onDelete('cascade');

            $table->foreign('subject_id')
                ->references('id')
                ->on('subjects')
                ->onDelete('cascade');

            $table->foreign('employee_id')
                ->references('id')
                ->on('employees')
                ->onDelete('cascade');

            // Prevent duplicate allocation
            $table->unique(
                [
                    'academic_year_id',
                    'class_id',
                    'subject_id'
                ],
                'teacher_allocation_unique'
            );

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('teacher_allocations');
    }
}