<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddBranchDepartmentDesignationToEmployeesTable extends Migration 
{
    public function up()        
    {
        Schema::table('employees', function (Blueprint $table) {

            $table->foreign('branch_id')
                ->references('id')
                ->on('branches')
                ->nullOnDelete();

            $table->foreign('department_id')
                ->references('id')
                ->on('departments')
                ->nullOnDelete();

            $table->foreign('designation_id')
                ->references('id')
                ->on('designations')
                ->nullOnDelete();
        });
    }

    public function down()        
    {
        Schema::table('employees', function (Blueprint $table) {

            $table->dropForeign(['branch_id']);
            $table->dropForeign(['department_id']);
            $table->dropForeign(['designation_id']);
        });
    }
}
