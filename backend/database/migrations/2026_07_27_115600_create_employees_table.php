<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEmployeesTable extends Migration
{
    public function up()
    {
        Schema::create('employees', function (Blueprint $table) {

            $table->bigIncrements('id');

            /*
            |--------------------------------------------------------------------------
            | Basic Information
            |--------------------------------------------------------------------------
            */

            $table->string('employee_code', 30)->unique();
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('full_name')->nullable();

            $table->string('profile_photo')->nullable();

            $table->string('phone_number')->nullable();
            $table->string('whatsapp_number')->nullable();

            $table->date('dob')->nullable();

            $table->enum('gender', ['Male', 'Female', 'Other'])->nullable();

            $table->string('region')->nullable();
            $table->string('caste')->nullable();
            $table->string('employee_type')->nullable();

            /*
            |--------------------------------------------------------------------------
            | Address
            |--------------------------------------------------------------------------
            */

            $table->text('present_address')->nullable();
            $table->text('permanent_address')->nullable();

            /*
            |--------------------------------------------------------------------------
            | Employment
            |--------------------------------------------------------------------------
            */

            $table->unsignedBigInteger('branch_id')->nullable();
            $table->unsignedBigInteger('department_id')->nullable();
            $table->unsignedBigInteger('designation_id')->nullable();

            $table->date('joining_date')->nullable();
            $table->date('last_working_date')->nullable();

            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();

            $table->time('saturday_in_time')->nullable();
            $table->time('saturday_out_time')->nullable();

            $table->string('shift')->default('Day Shift');

            $table->string('reference')->nullable();

            $table->string('marital_status')->nullable();

            /*
            |--------------------------------------------------------------------------
            | Contact
            |--------------------------------------------------------------------------
            */

            $table->string('email')->nullable();

            /*
            |--------------------------------------------------------------------------
            | Bank Details
            |--------------------------------------------------------------------------
            */

            $table->string('bank_name')->nullable();
            $table->string('branch_name')->nullable();
            $table->string('bank_account_number')->nullable();
            $table->string('bank_account_name')->nullable();
            $table->string('ifsc_code')->nullable();

            /*
            |--------------------------------------------------------------------------
            | Organisation
            |--------------------------------------------------------------------------
            */

            $table->string('organisation')->nullable();
            $table->unsignedBigInteger('organisation_id')->nullable();

            /*
            |--------------------------------------------------------------------------
            | Salary
            |--------------------------------------------------------------------------
            */

            $table->string('category')->nullable();

            $table->decimal('old_salary', 18, 2)->default(0);
            $table->decimal('salary_scale', 18, 2)->default(0);
            $table->decimal('retention_amount', 18, 2)->default(0);

            /*
            |--------------------------------------------------------------------------
            | Government Details
            |--------------------------------------------------------------------------
            */

            $table->string('uid_number')->nullable();
            $table->string('pf_number')->nullable();

            $table->string('pf')->nullable();
            $table->string('pt')->nullable();
            $table->string('esic')->nullable();
            $table->string('mlwf')->nullable();
            $table->string('tds')->nullable();

            $table->string('qualification')->nullable();

            $table->string('aadhaar_number')->nullable();
            $table->string('pan_number')->nullable();

            /*
            |--------------------------------------------------------------------------
            | Teaching
            |--------------------------------------------------------------------------
            */

            $table->string('teaching_subject')->nullable();

            /*
            |--------------------------------------------------------------------------
            | Reporting
            |--------------------------------------------------------------------------
            */

            $table->unsignedBigInteger('reporting_id')->nullable();
            $table->tinyInteger('reporting_type')->default(1);

            $table->unsignedBigInteger('buddy_id')->nullable();

            /*
            |--------------------------------------------------------------------------
            | Contract
            |--------------------------------------------------------------------------
            */

            $table->date('contract_start_date')->nullable();
            $table->date('contract_end_date')->nullable();

            /*
            |--------------------------------------------------------------------------
            | Social Media
            |--------------------------------------------------------------------------
            */

            $table->string('instagram_id')->nullable();
            $table->string('twitter_id')->nullable();
            $table->string('facebook_id')->nullable();

            /*
            |--------------------------------------------------------------------------
            | Working Status
            |--------------------------------------------------------------------------
            */

            $table->string('working_status')->nullable();

            /*
            |--------------------------------------------------------------------------
            | Experience
            |--------------------------------------------------------------------------
            */

            $table->string('experience_company')->nullable();
            $table->string('experience_designation')->nullable();
            $table->string('experience_last_salary')->nullable();
            $table->string('experience_duration')->nullable();
            $table->text('experience_job_description')->nullable();
            $table->text('experience_reason_for_leaving')->nullable();
            $table->string('experience_company_contact')->nullable();

            /*
            |--------------------------------------------------------------------------
            | Login
            |--------------------------------------------------------------------------
            */

            $table->string('username')->unique();

            $table->unsignedBigInteger('role_id')->nullable();

            /*
            |--------------------------------------------------------------------------
            | Documents
            |--------------------------------------------------------------------------
            */

            $table->string('pan_card_photo')->nullable();
            $table->string('aadhaar_card_photo')->nullable();
            $table->string('signature')->nullable();

            /*
            |--------------------------------------------------------------------------
            | Attendance
            |--------------------------------------------------------------------------
            */

            $table->tinyInteger('attendance_status')->default(0);
            $table->tinyInteger('attendance_log_status')->default(0);

            $table->string('attendance_type')->default('Automatic');

            /*
            |--------------------------------------------------------------------------
            | Verification
            |--------------------------------------------------------------------------
            */

            $table->tinyInteger('verify_status')->default(0);

            /*
            |--------------------------------------------------------------------------
            | Recruitment
            |--------------------------------------------------------------------------
            */

            $table->unsignedBigInteger('recruitment_number')->nullable();

            $table->string('reason',500)->nullable();

            /*
            |--------------------------------------------------------------------------
            | Misc
            |--------------------------------------------------------------------------
            */

            $table->tinyInteger('new_user')->default(1);
            $table->tinyInteger('attendance_time_status')->default(0);

            $table->integer('signature_id')->nullable();

            $table->tinyInteger('data_fetch')->default(1);
            $table->tinyInteger('temp_status')->default(0);

            $table->string('id_card_status')->default('Pending');

            $table->tinyInteger('tp_status')->default(0);

            /*
            |--------------------------------------------------------------------------
            | Status
            |--------------------------------------------------------------------------
            */

            $table->boolean('active')->default(true);

            /*
            |--------------------------------------------------------------------------
            | Audit
            |--------------------------------------------------------------------------
            */

            $table->string('added_by')->nullable();
            $table->string('updated_by')->nullable();

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('employees');
    }
}