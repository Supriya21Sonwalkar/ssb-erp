<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStudentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('students', function (Blueprint $table) {

            $table->bigIncrements('id');

            /*
            |--------------------------------------------------------------------------
            | Student Identification
            |--------------------------------------------------------------------------
            */

            $table->string('student_code', 30)->unique();

            $table->string('admission_no', 30)->unique();

            /*
            |--------------------------------------------------------------------------
            | Academic Information
            |--------------------------------------------------------------------------
            */

            $table->unsignedBigInteger('academic_year_id');

            $table->unsignedBigInteger('class_id');

            $table->unsignedBigInteger('section_id')->nullable();

            $table->date('admission_date');

            $table->enum('admission_type', [
                'New Admission',
                'Re-Admission',
                'Transfer'
            ])->default('New Admission');

            $table->enum('admission_status', [
                'Registered',
                'Promoted',
                'Demoted',
                'Transferred',
                'Left',
                'Passed Out'
            ])->default('Registered');

            /*
            |--------------------------------------------------------------------------
            | Personal Information
            |--------------------------------------------------------------------------
            */

            $table->string('first_name', 100);

            $table->string('middle_name', 100)->nullable();

            $table->string('last_name', 100);

            $table->string('full_name', 255);

            $table->enum('gender', [
                'Male',
                'Female',
                'Other'
            ]);

            $table->date('dob');

            $table->string('blood_group', 10)->nullable();

            $table->string('category', 50)->nullable();

            $table->string('caste', 100)->nullable();

            $table->string('sub_caste', 100)->nullable();

            $table->string('religion', 100)->nullable();

            $table->string('nationality', 100)->default('Indian');

            $table->string('mother_tongue', 100)->nullable();

            $table->string('birth_place')->nullable();

            $table->string('house', 100)->nullable();

            /*
            |--------------------------------------------------------------------------
            | Government Details
            |--------------------------------------------------------------------------
            */

            $table->string('aadhaar_number', 20)->nullable()->unique();

            $table->string('apaar_id', 50)->nullable()->unique();

            $table->string('pen_number', 50)->nullable()->unique();

            $table->string('birth_certificate_no', 100)->nullable();

            /*
            |--------------------------------------------------------------------------
            | Previous School
            |--------------------------------------------------------------------------
            */

            $table->string('previous_school')->nullable();

            /*
            |--------------------------------------------------------------------------
            | Transport / Hostel
            |--------------------------------------------------------------------------
            */

            $table->boolean('transport_required')->default(false);

            $table->boolean('hostel_required')->default(false);

            /*
            |--------------------------------------------------------------------------
            | Student Photo
            |--------------------------------------------------------------------------
            */

            $table->string('photo')->nullable();

            /*
            |--------------------------------------------------------------------------
            | Remarks
            |--------------------------------------------------------------------------
            */

            $table->text('remarks')->nullable();

            /*
            |--------------------------------------------------------------------------
            | Status
            |--------------------------------------------------------------------------
            */

            $table->boolean('status')->default(true);

            /*
            |--------------------------------------------------------------------------
            | Audit
            |--------------------------------------------------------------------------
            */

            $table->unsignedBigInteger('created_by')->nullable();

            $table->unsignedBigInteger('updated_by')->nullable();

            $table->timestamps();

            /*
            |--------------------------------------------------------------------------
            | Foreign Keys
            |--------------------------------------------------------------------------
            */

            $table->foreign('academic_year_id')
                ->references('id')
                ->on('academic_years')
                ->onDelete('restrict');

            $table->foreign('class_id')
                ->references('id')
                ->on('classes')
                ->onDelete('restrict');

            $table->foreign('section_id')
                ->references('id')
                ->on('sections')
                ->onDelete('restrict');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('students');
    }
}