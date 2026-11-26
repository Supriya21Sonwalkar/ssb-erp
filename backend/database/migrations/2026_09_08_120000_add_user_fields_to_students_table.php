<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddUserFieldsToStudentsTable extends Migration
{
    public function up(): void
    {
        Schema::table('students', function (Blueprint $table) {
            if (!Schema::hasColumn('students', 'user_id')) {
                $table->foreignId('user_id')
                      ->nullable()
                      ->constrained('users')
                      ->cascadeOnUpdate()
                      ->nullOnDelete()
                      ->after('id');
            }
            if (!Schema::hasColumn('students', 'email')) {
                $table->string('email', 150)->nullable()->unique()->after('full_name');
            }
            if (!Schema::hasColumn('students', 'mobile')) {
                $table->string('mobile', 20)->nullable()->after('email');
            }
        });
    }

    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            if (Schema::hasColumn('students', 'user_id')) {
                $table->dropConstrainedForeignId('user_id');
            }
            if (Schema::hasColumn('students', 'email')) {
                $table->dropUnique(['email']);
                $table->dropColumn('email');
            }
            if (Schema::hasColumn('students', 'mobile')) {
                $table->dropColumn('mobile');
            }
        });
    }
}
