<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRoleMenuPermissionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('role_menu_permissions', function (Blueprint $table) {
            $table->bigIncrements('id');

            $table->unsignedBigInteger('role_id');
            $table->unsignedBigInteger('menu_id');

            $table->timestamps();

            // Prevent duplicate menu assignments for the same role.
            $table->unique(
                ['role_id', 'menu_id'],
                'role_menu_permissions_role_menu_unique'
            );

            $table->foreign('role_id')
                ->references('id')
                ->on('roles')
                ->onDelete('cascade');

            $table->foreign('menu_id')
                ->references('id')
                ->on('menus')
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
        Schema::dropIfExists('role_menu_permissions');
    }
}