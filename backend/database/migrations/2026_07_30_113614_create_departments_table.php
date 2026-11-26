<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDepartmentsTable extends Migration
{
    public function up()        
    {
        Schema::create('departments', function (Blueprint $table) {
            $table->id();

            $table->string('department_name');
            $table->string('department_code')->nullable()->unique();
            $table->text('description')->nullable();

            $table->boolean('status')->default(1);

            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();

            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down()        
    {
        Schema::dropIfExists('departments');
    }
}
