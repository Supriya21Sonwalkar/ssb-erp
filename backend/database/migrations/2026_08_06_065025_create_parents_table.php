<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateParentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('parents', function (Blueprint $table) {

            $table->bigIncrements('id');

            /*
            |--------------------------------------------------------------------------
            | Father Details
            |--------------------------------------------------------------------------
            */

            $table->string('father_name');

            $table->string('father_mobile',15);

            $table->string('father_email')->nullable();

            $table->string('father_occupation')->nullable();

            $table->decimal('father_income',12,2)->nullable();

            /*
            |--------------------------------------------------------------------------
            | Mother Details
            |--------------------------------------------------------------------------
            */

            $table->string('mother_name')->nullable();

            $table->string('mother_mobile',15)->nullable();

            $table->string('mother_email')->nullable();

            $table->string('mother_occupation')->nullable();

            $table->decimal('mother_income',12,2)->nullable();

            /*
            |--------------------------------------------------------------------------
            | Guardian Details
            |--------------------------------------------------------------------------
            */

            $table->string('guardian_name')->nullable();

            $table->string('guardian_relation')->nullable();

            $table->string('guardian_mobile',15)->nullable();

            /*
            |--------------------------------------------------------------------------
            | Address
            |--------------------------------------------------------------------------
            */

            $table->text('address');

            $table->string('city')->nullable();

            $table->string('state')->nullable();

            $table->string('country')->default('India');

            $table->string('pincode',10)->nullable();

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

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('parents');
    }
}