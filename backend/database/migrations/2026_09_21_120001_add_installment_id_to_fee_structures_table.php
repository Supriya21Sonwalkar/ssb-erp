<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddInstallmentIdToFeeStructuresTable extends Migration
{
    public function up()
    {
        Schema::table('fee_structures', function (Blueprint $table) {

            $table->unsignedBigInteger('installment_id')->nullable()->after('academic_year_id');

            $table->index('installment_id');

            $table->foreign('installment_id')
                ->references('id')
                ->on('installments')
                ->onDelete('set null')
                ->onUpdate('cascade');

            $table->dropUnique('fee_structure_component_course_year_unique');

            $table->unique(
                [
                    'fee_component_id',
                    'course_id',
                    'academic_year_id',
                    'installment_id'
                ],
                'fee_structure_component_course_year_installment_unique'
            );
        });
    }

    public function down()
    {
        Schema::table('fee_structures', function (Blueprint $table) {

            $table->dropUnique('fee_structure_component_course_year_installment_unique');

            $table->dropForeign(['installment_id']);

            $table->dropIndex(['installment_id']);

            $table->dropColumn('installment_id');

            $table->unique(
                [
                    'fee_component_id',
                    'course_id',
                    'academic_year_id'
                ],
                'fee_structure_component_course_year_unique'
            );
        });
    }
}
