<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBookingsTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()        
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            // Cadet personal info
            $table->string('full_name');
            $table->date('date_of_birth')->nullable();
            $table->string('gender')->nullable();           // male / female / other
            // Parent / guardian info
            $table->string('father_name')->nullable();
            $table->string('mother_name')->nullable();
            // Contact
            $table->string('phone');
            $table->string('email');
            // Address
            $table->text('address')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            // Course & payment
            $table->foreignId('course_id')->nullable()->constrained()->nullOnDelete();
            $table->string('course_interest')->nullable();  // denormalised course title
            $table->decimal('fees_amount', 10, 2)->nullable();
            $table->string('payment_status')->default('pending'); // pending / paid
            // Extra
            $table->text('message')->nullable();
            $table->string('ip_address')->nullable();
            $table->string('status')->default('new');        // new / confirmed / cancelled
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()        
    {
        Schema::dropIfExists('bookings');
    }
}       
