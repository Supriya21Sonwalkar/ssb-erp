<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddStatusToAttendanceSessionsTable extends Migration
{
    public function up()
{
    Schema::table('attendance_sessions', function (Blueprint $table) {

        $table->tinyInteger('status')
              ->default(1)
              ->after('is_locked')
              ->comment('1 = Active, 0 = Inactive');

    });
}

public function down()
{
    Schema::table('attendance_sessions', function (Blueprint $table) {

        $table->dropColumn('status');

    });
}
}
