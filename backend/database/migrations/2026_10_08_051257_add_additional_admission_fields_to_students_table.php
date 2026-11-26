<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddAdditionalAdmissionFieldsToStudentsTable extends Migration
{
    public function up()
    {
        Schema::table('students', function (Blueprint $table) {

            $table->string('form_no', 50)->nullable()->after('admission_no');

            $table->string('landmark', 255)->nullable()->after('house');

            $table->string('previous_school_u_dise_no', 50)
                ->nullable()
                ->after('previous_school');

            $table->text('previous_school_address')
                ->nullable()
                ->after('previous_school_u_dise_no');

            $table->string('previous_school_board', 100)
                ->nullable()
                ->after('previous_school_address');

            $table->string('previous_school_class', 100)
                ->nullable()
                ->after('previous_school_board');

            $table->string('previous_school_percentage_grade', 100)
                ->nullable()
                ->after('previous_school_class');

            $table->text('other_illness')
                ->nullable()
                ->after('remarks');

            $table->string('gr_no', 50)
                ->nullable()
                ->after('other_illness');

            $table->text('sibling_info')
                ->nullable()
                ->after('gr_no');

            $table->string('saral_id', 100)
                ->nullable()
                ->after('sibling_info');

            $table->string('birth_taluka', 100)
                ->nullable()
                ->after('birth_place');

            $table->string('birth_district', 100)
                ->nullable()
                ->after('birth_taluka');

            $table->string('birth_state', 100)
                ->nullable()
                ->after('birth_district');

            $table->string('birth_country', 100)
                ->nullable()
                ->after('birth_state');

            $table->string('class_admitted_aws', 100)
                ->nullable()
                ->after('class_id');

            $table->string('caution_fee_receipt_no', 100)
                ->nullable()
                ->after('class_admitted_aws');
        });
    }

    public function down()
    {
        Schema::table('students', function (Blueprint $table) {

            $table->dropColumn([
                'form_no',
                'landmark',
                'previous_school_u_dise_no',
                'previous_school_address',
                'previous_school_board',
                'previous_school_class',
                'previous_school_percentage_grade',
                'other_illness',
                'gr_no',
                'sibling_info',
                'saral_id',
                'birth_taluka',
                'birth_district',
                'birth_state',
                'birth_country',
                'class_admitted_aws',
                'caution_fee_receipt_no',
            ]);
        });
    }
}