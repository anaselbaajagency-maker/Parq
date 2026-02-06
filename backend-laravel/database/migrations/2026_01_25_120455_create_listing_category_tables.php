<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('listing_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('listing_id')->constrained()->cascadeOnDelete();
            $table->string('image_path');
            $table->boolean('is_main')->default(false);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('listing_cars', function (Blueprint $table) {
            $table->id();
            $table->foreignId('listing_id')->constrained()->cascadeOnDelete();
            $table->string('fuel_type')->nullable();
            $table->string('gearbox')->nullable();
            $table->integer('seats')->nullable();
            $table->timestamps();
        });

        Schema::create('listing_machinery', function (Blueprint $table) {
            $table->id();
            $table->foreignId('listing_id')->constrained()->cascadeOnDelete();
            $table->string('brand')->nullable();
            $table->string('model')->nullable();
            $table->string('tonnage')->nullable();
            $table->integer('year')->nullable();
            $table->boolean('with_driver')->default(false);
            $table->timestamps();
        });

        Schema::create('listing_transports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('listing_id')->constrained()->cascadeOnDelete();
            $table->integer('capacity')->nullable();
            $table->boolean('air_conditioning')->default(false);
            $table->string('usage_type')->nullable(); // tourism, staff
            $table->timestamps();
        });

        Schema::create('listing_drivers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('listing_id')->constrained()->cascadeOnDelete();
            $table->string('license_type')->nullable();
            $table->integer('experience_years')->nullable();
            $table->boolean('is_available')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('listing_drivers');
        Schema::dropIfExists('listing_transports');
        Schema::dropIfExists('listing_machinery');
        Schema::dropIfExists('listing_cars');
        Schema::dropIfExists('listing_images');
    }
};
