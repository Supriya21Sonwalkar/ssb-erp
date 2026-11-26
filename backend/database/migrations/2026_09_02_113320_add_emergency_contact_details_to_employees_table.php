<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddEmergencyContactDetailsToEmployeesTable extends Migration
{
public function up()
{
    Schema::table('employees', function (Blueprint $table) {

        $table->string('emergency_contact_1_name', 100)->nullable();
        $table->string('emergency_contact_1_relation', 50)->nullable();
        $table->string('emergency_contact_1_place', 150)->nullable();
        $table->string('emergency_contact_1_phone', 20)->nullable();

        $table->string('emergency_contact_2_name', 100)->nullable();
        $table->string('emergency_contact_2_relation', 50)->nullable();
        $table->string('emergency_contact_2_place', 150)->nullable();
        $table->string('emergency_contact_2_phone', 20)->nullable();

    });
}

public function down()
{
    Schema::table('employees', function (Blueprint $table) {
        $table->dropColumn([
            'emergency_contact_1_name',
            'emergency_contact_1_relation',
            'emergency_contact_1_place',
            'emergency_contact_1_phone',
            'emergency_contact_2_name',
            'emergency_contact_2_relation',
            'emergency_contact_2_place',
            'emergency_contact_2_phone',
        ]);
    });
}
}
