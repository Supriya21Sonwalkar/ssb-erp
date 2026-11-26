<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateHomeworkSubmissionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('homework_submissions', function (Blueprint $table) {

            $table->bigIncrements('id');

            $table->unsignedBigInteger('homework_assignment_id');
            $table->unsignedBigInteger('student_id');

            // Student Submission
            $table->text('submission_text')->nullable();
            $table->dateTime('submission_date')->nullable();

            // Single submission attachment for now
            $table->string('attachment_name', 255)->nullable();
            $table->string('attachment_path', 500)->nullable();
            $table->string('attachment_type', 100)->nullable();
            $table->unsignedBigInteger('attachment_size')->nullable();

            // Submission Status
            $table->string('status', 30)->default('Pending');

            // Evaluation
            $table->decimal('marks', 8, 2)->nullable();
            $table->text('teacher_remarks')->nullable();

            // Checking
            $table->unsignedBigInteger('checked_by')->nullable();
            $table->dateTime('checked_at')->nullable();

            $table->timestamps();

            // Indexes
            $table->index('homework_assignment_id');
            $table->index('student_id');
            $table->index('status');
            $table->index('checked_by');

            // One submission per student per homework
            $table->unique(
                array('homework_assignment_id', 'student_id'),
                'homework_student_unique'
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
        Schema::dropIfExists('homework_submissions');
    }
}