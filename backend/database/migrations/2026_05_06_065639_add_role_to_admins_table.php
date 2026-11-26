<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddRoleToAdminsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('admins', function (Blueprint $table) {
            $table->enum('role', ['super_admin', 'counsellor', 'media_manager', 'content_editor'])->default('content_editor')->after('email');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void         
     */
    public function down()
    {
        Schema::table('admins', function (Blueprint $table) {
            //
        });
    }
}   
// AddRoleToAdminsTable.php         
