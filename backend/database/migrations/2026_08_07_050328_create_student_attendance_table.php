<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStudentAttendanceTable extends Migration
{
    public function up()
    {
        Schema::create('student_attendance', function (Blueprint $table) {

            $table->bigIncrements('id');

            $table->unsignedBigInteger('attendance_session_id');
            $table->unsignedBigInteger('student_id');

            $table->enum('attendance_status', [
                'P',
                'A',
                'L',
                'HD',
                'H'
            ])->default('P');

            $table->time('arrival_time')->nullable();

            $table->time('departure_time')->nullable();

            $table->integer('late_minutes')->default(0);

            $table->text('remarks')->nullable();

            $table->timestamps();

            $table->foreign('attendance_session_id')
                ->references('id')
                ->on('attendance_sessions')
                ->onDelete('cascade');

            $table->foreign('student_id')
                ->references('id')
                ->on('students')
                ->onDelete('cascade');

            $table->unique([
                'attendance_session_id',
                'student_id'
            ]);

        });
    }

    public function down()
    {
        Schema::dropIfExists('student_attendance');
    }
}