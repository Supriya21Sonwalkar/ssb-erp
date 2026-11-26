<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCommunicationNoticesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('communication_notices', function (Blueprint $table) {
            $table->bigIncrements('id');

            $table->string('notice_no', 50)->unique();
            $table->string('title', 255);

            $table->text('description');

            $table->string('notice_type', 50)->default('General');
            $table->string('priority', 30)->default('Normal');

            $table->date('publish_date');
            $table->date('expiry_date')->nullable();

            $table->string('attachment', 500)->nullable();

            $table->string('target_type', 50)->default('All');

            $table->boolean('is_active')->default(true);

            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();

            $table->timestamps();

            $table->index('notice_type');
            $table->index('priority');
            $table->index('publish_date');
            $table->index('expiry_date');
            $table->index('target_type');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('communication_notices');
    }
}