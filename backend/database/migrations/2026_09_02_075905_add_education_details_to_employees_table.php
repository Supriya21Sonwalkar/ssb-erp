<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddEducationDetailsToEmployeesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('employees', function (Blueprint $table) {

            // Std 10
            $table->string('board_10th')->nullable()->after('qualification');
            $table->string('year_pass_10th')->nullable()->after('board_10th');
            $table->decimal('percentage_10th', 5, 2)->nullable()->after('year_pass_10th');

            // Std 12
            $table->string('board_12th')->nullable()->after('percentage_10th');
            $table->string('year_pass_12th')->nullable()->after('board_12th');
            $table->decimal('percentage_12th', 5, 2)->nullable()->after('year_pass_12th');

            // Graduate
            $table->string('board_graduate')->nullable()->after('percentage_12th');
            $table->string('year_pass_graduate')->nullable()->after('board_graduate');
            $table->decimal('percentage_graduate', 5, 2)->nullable()->after('year_pass_graduate');

            // Post Graduate
            $table->string('board_post_graduate')->nullable()->after('percentage_graduate');
            $table->string('year_pass_post_graduate')->nullable()->after('board_post_graduate');
            $table->decimal('percentage_post_graduate', 5, 2)->nullable()->after('year_pass_post_graduate');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('employees', function (Blueprint $table) {

            $table->dropColumn([
                'board_10th',
                'year_pass_10th',
                'percentage_10th',

                'board_12th',
                'year_pass_12th',
                'percentage_12th',

                'board_graduate',
                'year_pass_graduate',
                'percentage_graduate',

                'board_post_graduate',
                'year_pass_post_graduate',
                'percentage_post_graduate',
            ]);

        });
    }
}