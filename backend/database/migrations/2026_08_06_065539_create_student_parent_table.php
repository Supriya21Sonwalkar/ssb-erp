<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStudentParentTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('student_parent', function (Blueprint $table) {

            $table->bigIncrements('id');

            $table->unsignedBigInteger('student_id');

            $table->unsignedBigInteger('parent_id');

            $table->timestamps();

            $table->foreign('student_id')
                ->references('id')
                ->on('students')
                ->onDelete('cascade');

            $table->foreign('parent_id')
                ->references('id')
                ->on('parents')
                ->onDelete('cascade');

            $table->unique([
                'student_id',
                'parent_id'
            ]);

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('student_parent');
    }
}