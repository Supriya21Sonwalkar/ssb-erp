<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDesignationsTable extends Migration
{
    public function up()            
    {
        Schema::create('designations', function (Blueprint $table) {
            $table->id();

            $table->string('designation_name');
            $table->string('designation_code')->nullable()->unique();
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
        Schema::dropIfExists('designations');
    }
}
