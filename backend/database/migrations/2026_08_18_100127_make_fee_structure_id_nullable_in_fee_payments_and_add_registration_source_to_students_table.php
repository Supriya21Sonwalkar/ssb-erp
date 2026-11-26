<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class MakeFeeStructureIdNullableInFeePaymentsAndAddRegistrationSourceToStudentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $constraints = DB::select('SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = "fee_payments" AND COLUMN_NAME = "fee_structure_id" AND REFERENCED_COLUMN_NAME IS NOT NULL');
        
        if (!empty($constraints)) {
            $fkName = $constraints[0]->CONSTRAINT_NAME;
            DB::statement("ALTER TABLE fee_payments DROP FOREIGN KEY `{$fkName}`");
        }
        
        DB::statement('ALTER TABLE fee_payments MODIFY COLUMN fee_structure_id BIGINT UNSIGNED NULL');
        
        Schema::table('fee_payments', function (Blueprint $table) {
            $table->foreign('fee_structure_id')
                ->references('id')
                ->on('fee_structures')
                ->onDelete('set null');
        });

        Schema::table('students', function (Blueprint $table) {
            $table->boolean('is_self_registered')->default(false)->after('status');
            $table->string('registration_source', 50)->default('admin')->after('is_self_registered');
            $table->decimal('advance_amount_paid', 12, 2)->default(0)->after('registration_source');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn('advance_amount_paid');
            $table->dropColumn('registration_source');
            $table->dropColumn('is_self_registered');
        });

        $constraints = DB::select('SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = "fee_payments" AND COLUMN_NAME = "fee_structure_id" AND REFERENCED_COLUMN_NAME IS NOT NULL');
        
        if (!empty($constraints)) {
            $fkName = $constraints[0]->CONSTRAINT_NAME;
            DB::statement("ALTER TABLE fee_payments DROP FOREIGN KEY `{$fkName}`");
        }
        
        DB::statement('ALTER TABLE fee_payments MODIFY COLUMN fee_structure_id BIGINT UNSIGNED NOT NULL');
        
        Schema::table('fee_payments', function (Blueprint $table) {
            $table->foreign('fee_structure_id')
                ->references('id')
                ->on('fee_structures')
                ->onDelete('restrict');
        });
    }
}
