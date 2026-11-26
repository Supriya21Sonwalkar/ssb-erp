<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInstallmentsTable extends Migration
{
    public function up()
    {
        Schema::create('installments', function (Blueprint $table) {

            $table->bigIncrements('id');

            $table->unsignedBigInteger('academic_year_id');

            $table->string('name', 150);

            $table->date('start_date');

            $table->date('end_date');

            $table->boolean('status')->default(true);

            $table->text('description')->nullable();

            $table->unsignedBigInteger('created_by')->nullable();

            $table->unsignedBigInteger('updated_by')->nullable();

            $table->timestamps();

            $table->index('academic_year_id');
            $table->index('status');
            $table->index('start_date');
            $table->index('end_date');

            $table->foreign('academic_year_id')
                ->references('id')
                ->on('academic_years')
                ->onDelete('restrict')
                ->onUpdate('cascade');

            $table->unique(
                ['academic_year_id', 'name'],
                'installment_academic_year_name_unique'
            );
        });
    }

    public function down()
    {
        Schema::dropIfExists('installments');
    }
}
