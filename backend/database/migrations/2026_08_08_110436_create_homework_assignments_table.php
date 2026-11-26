<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateHomeworkAssignmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('homework_assignments', function (Blueprint $table) {

            $table->bigIncrements('id');

            // Academic Information
            $table->unsignedBigInteger('academic_year_id');
            $table->unsignedBigInteger('class_id');
            $table->unsignedBigInteger('section_id');
            $table->unsignedBigInteger('subject_id');

            // Homework Information
            $table->string('title', 255);
            $table->string('homework_type', 50)->default('Homework');
            $table->text('description')->nullable();

            // Dates
            $table->date('assigned_date');
            $table->date('due_date');

            // Marks
            $table->decimal('total_marks', 8, 2)->nullable();

            // Late Submission
            $table->tinyInteger('allow_late_submission')->default(0);

            // Status
            $table->string('status', 30)->default('Draft');

            // Created / Updated By
            $table->unsignedBigInteger('created_by');
            $table->unsignedBigInteger('updated_by')->nullable();

            $table->timestamps();

            // Indexes
            $table->index('academic_year_id');
            $table->index('class_id');
            $table->index('section_id');
            $table->index('subject_id');
            $table->index('created_by');
            $table->index('status');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('homework_assignments');
    }
}