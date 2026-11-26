<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLectureAttendanceSessionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('lecture_attendance_sessions', function (Blueprint $table) {

            $table->bigIncrements('id');

            /*
            |--------------------------------------------------------------------------
            | Academic / Class Details
            |--------------------------------------------------------------------------
            */

            $table->unsignedBigInteger('academic_year_id');

            $table->unsignedBigInteger('class_id');

            $table->unsignedBigInteger('section_id')->nullable();

            /*
            |--------------------------------------------------------------------------
            | Lecture Details
            |--------------------------------------------------------------------------
            */

            $table->date('lecture_date');

            $table->unsignedInteger('lecture_no');

            $table->unsignedBigInteger('subject_id');

            $table->unsignedBigInteger('teacher_id')->nullable();

            /*
            |--------------------------------------------------------------------------
            | Lecture Timing
            |--------------------------------------------------------------------------
            */

            $table->time('start_time')->nullable();

            $table->time('end_time')->nullable();

            /*
            |--------------------------------------------------------------------------
            | Status
            |--------------------------------------------------------------------------
            */

            $table->boolean('is_locked')->default(false);

            $table->unsignedBigInteger('marked_by')->nullable();

            $table->timestamps();

            /*
            |--------------------------------------------------------------------------
            | Indexes
            |--------------------------------------------------------------------------
            */

            $table->index('academic_year_id');

            $table->index('class_id');

            $table->index('section_id');

            $table->index('lecture_date');

            $table->index('subject_id');

            $table->index('teacher_id');

            /*
            |--------------------------------------------------------------------------
            | Prevent Duplicate Lecture
            |--------------------------------------------------------------------------
            */

            $table->unique(
                [
                    'academic_year_id',
                    'class_id',
                    'section_id',
                    'lecture_date',
                    'lecture_no',
                    'subject_id'
                ],
                'unique_lecture_session'
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
        Schema::dropIfExists('lecture_attendance_sessions');
    }
}