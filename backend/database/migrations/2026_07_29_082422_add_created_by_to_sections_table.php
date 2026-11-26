<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddCreatedByToSectionsTable extends Migration 
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('sections', function ($table) {
            $table->unsignedBigInteger('created_by')->nullable()->after('status');
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('sections', function ($table) {
            $table->dropColumn('created_by');
        });
    }
}
