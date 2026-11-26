<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddAdditionalParentDetailsToParentsTable extends Migration
{
    public function up()
    {
        Schema::table('parents', function (Blueprint $table) {

            // Father Details
            $table->date('father_birth_date')
                ->nullable()
                ->after('father_name');

            $table->string('father_birth_place', 255)
                ->nullable()
                ->after('father_birth_date');

            $table->string('father_religion', 100)
                ->nullable()
                ->after('father_birth_place');

            $table->string('father_education_qualification', 255)
                ->nullable()
                ->after('father_occupation');

            $table->string('father_whatsapp', 15)
                ->nullable()
                ->after('father_mobile');

            $table->string('father_pan_election_no', 100)
                ->nullable()
                ->after('father_email');

            $table->string('father_aadhaar_number', 20)
                ->nullable()
                ->after('father_pan_election_no');


            // Mother Details
            $table->date('mother_birth_date')
                ->nullable()
                ->after('mother_name');

            $table->string('mother_birth_place', 255)
                ->nullable()
                ->after('mother_birth_date');

            $table->string('mother_religion', 100)
                ->nullable()
                ->after('mother_birth_place');

            $table->string('mother_education_qualification', 255)
                ->nullable()
                ->after('mother_occupation');

            $table->string('mother_whatsapp', 15)
                ->nullable()
                ->after('mother_mobile');

            $table->string('mother_pan_election_no', 100)
                ->nullable()
                ->after('mother_email');

            $table->string('mother_aadhaar_number', 20)
                ->nullable()
                ->after('mother_pan_election_no');
        });
    }

    public function down()
    {
        Schema::table('parents', function (Blueprint $table) {

            $table->dropColumn([
                'father_birth_date',
                'father_birth_place',
                'father_religion',
                'father_education_qualification',
                'father_whatsapp',
                'father_pan_election_no',
                'father_aadhaar_number',

                'mother_birth_date',
                'mother_birth_place',
                'mother_religion',
                'mother_education_qualification',
                'mother_whatsapp',
                'mother_pan_election_no',
                'mother_aadhaar_number',
            ]);
        });
    }
}