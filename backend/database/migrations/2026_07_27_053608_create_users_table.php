<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    public function up()    
    {
        Schema::create('users', function (Blueprint $table) {

            $table->id();

            $table->foreignId('role_id')
                  ->constrained('roles')
                  ->cascadeOnUpdate()
                  ->restrictOnDelete();

            $table->string('employee_code',30)->nullable()->unique();

            $table->string('name');

            $table->string('email')->unique();

            $table->string('mobile',20)->nullable();

            $table->string('password');

            $table->string('profile_photo')->nullable();

            $table->timestamp('email_verified_at')->nullable();

            $table->rememberToken();

            $table->timestamp('last_login_at')->nullable();

            $table->string('last_login_ip',45)->nullable();

            $table->boolean('status')->default(true);

            $table->timestamps();

            $table->softDeletes();

        });
    }

    public function down()        
    {
        Schema::dropIfExists('users');
    }
}           
