<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAttendanceLogsTable extends Migration
{
    public function up()
    {
        Schema::create('attendance_logs', function (Blueprint $table) {

            $table->bigIncrements('id');

            $table->unsignedBigInteger('attendance_id');

            $table->string('old_status', 10)->nullable();

            $table->string('new_status', 10);

            $table->unsignedBigInteger('changed_by');

            $table->text('reason')->nullable();

            $table->timestamps();

            $table->foreign('attendance_id')
                ->references('id')
                ->on('student_attendance')
                ->onDelete('cascade');

            $table->index('changed_by');
        });
    }

    public function down()
    {
        Schema::dropIfExists('attendance_logs');
    }
}