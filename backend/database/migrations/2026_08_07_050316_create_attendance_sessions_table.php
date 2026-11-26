<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAttendanceSessionsTable extends Migration
{
    public function up()
    {
        Schema::create('attendance_sessions', function (Blueprint $table) {

            $table->bigIncrements('id');

            $table->unsignedBigInteger('academic_year_id')->nullable();
            $table->unsignedBigInteger('class_id');
            $table->unsignedBigInteger('section_id');

            $table->date('attendance_date');

            $table->enum('attendance_type', [
                'Daily',
                'Morning',
                'Afternoon'
            ])->default('Daily');

            $table->boolean('is_locked')->default(false);

            $table->unsignedBigInteger('marked_by')->nullable();
            $table->unsignedBigInteger('verified_by')->nullable();

            $table->text('remarks')->nullable();

            $table->timestamps();

            $table->unique([
                'academic_year_id',
                'class_id',
                'section_id',
                'attendance_date',
                'attendance_type'
            ], 'attendance_session_unique');

            $table->index('attendance_date');
            $table->index('class_id');
            $table->index('section_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('attendance_sessions');
    }
}