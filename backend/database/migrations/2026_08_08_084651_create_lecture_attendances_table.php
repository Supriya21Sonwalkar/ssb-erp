<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLectureAttendancesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('lecture_attendances', function (Blueprint $table) {

            $table->bigIncrements('id');

            $table->unsignedBigInteger('lecture_attendance_session_id');

            $table->unsignedBigInteger('student_id');

            $table->enum('attendance_status', [
                'P',
                'A'
            ])->default('P');

            $table->text('remarks')->nullable();

            $table->timestamps();

            $table->index('lecture_attendance_session_id');

            $table->index('student_id');

            $table->unique(
                [
                    'lecture_attendance_session_id',
                    'student_id'
                ],
                'unique_lecture_student_attendance'
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
        Schema::dropIfExists('lecture_attendances');
    }
}