<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddEmployeeDocumentFieldsToEmployeesTable extends Migration
{
    public function up()
    {
        Schema::table('employees', function (Blueprint $table) {

            $table->text('bank_details_document')->nullable();
            $table->text('driving_license_document')->nullable();

            $table->text('marksheet_10th')->nullable();
            $table->text('marksheet_12th')->nullable();

            $table->text('graduation_certificate')->nullable();
            $table->text('post_graduation_certificate')->nullable();

            $table->text('policy_document')->nullable();
            $table->text('other_documents')->nullable();

        });
    }

    public function down()
    {
        Schema::table('employees', function (Blueprint $table) {

            $table->dropColumn([
                'bank_details_document',
                'driving_license_document',
                'marksheet_10th',
                'marksheet_12th',
                'graduation_certificate',
                'post_graduation_certificate',
                'policy_document',
                'other_documents',
            ]);

        });
    }
}