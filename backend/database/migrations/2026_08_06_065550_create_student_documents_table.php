<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStudentDocumentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('student_documents', function (Blueprint $table) {

            $table->bigIncrements('id');

            $table->unsignedBigInteger('student_id');

            $table->string('document_type');

            $table->string('document_name');

            $table->string('document_path');

            $table->integer('quantity')->default(1);

            $table->text('remarks')->nullable();

            $table->boolean('status')->default(true);

            $table->timestamps();

            $table->foreign('student_id')
                ->references('id')
                ->on('students')
                ->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('student_documents');
    }
}