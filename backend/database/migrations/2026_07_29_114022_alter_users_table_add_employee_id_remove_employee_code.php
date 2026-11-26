<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterUsersTableAddEmployeeIdRemoveEmployeeCode extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()        
    {
        Schema::table('users', function (Blueprint $table) {

            // Remove employee_code
            $table->dropUnique(['employee_code']);
            $table->dropColumn('employee_code');

            // Add employee_id
            $table->unsignedBigInteger('employee_id')
                  ->nullable()
                  ->after('role_id');

            $table->foreign('employee_id')
                  ->references('id')
                  ->on('employees')
                  ->cascadeOnUpdate()
                  ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()          
    {
        Schema::table('users', function (Blueprint $table) {

            $table->dropForeign(['employee_id']);
            $table->dropColumn('employee_id');

            $table->string('employee_code',30)
                  ->nullable()
                  ->unique()
                  ->after('role_id');
        });
    }
}
