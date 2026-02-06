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
        // Cars / Véhicules légers
        if (!Schema::hasTable('listing_cars')) {
            Schema::create('listing_cars', function (Blueprint $table) {
                $table->id();
                $table->foreignId('listing_id')->constrained()->cascadeOnDelete();
                $table->string('fuel_type')->nullable(); // Essence, Diesel, Hybride, Électrique
                $table->string('gearbox')->nullable(); // Manuelle, Automatique
                $table->integer('seats')->nullable();
                $table->timestamps();
            });
        }

        // Heavy Machinery / Engins
        if (!Schema::hasTable('listing_machineries')) {
            Schema::create('listing_machineries', function (Blueprint $table) {
                $table->id();
                $table->foreignId('listing_id')->constrained()->cascadeOnDelete();
                $table->string('brand')->nullable();
                $table->string('model')->nullable();
                $table->string('tonnage')->nullable();
                $table->integer('year')->nullable();
                $table->string('power')->nullable(); // Chevaux
                $table->string('condition')->nullable(); // Neuf, Occasion, etc.
                $table->boolean('with_driver')->default(false);
                $table->timestamps();
            });
        }

        // Transport / Camions / Bus
        if (!Schema::hasTable('listing_transports')) {
            Schema::create('listing_transports', function (Blueprint $table) {
                $table->id();
                $table->foreignId('listing_id')->constrained()->cascadeOnDelete();
                $table->float('capacity')->nullable(); // Tonnage ou Volume
                $table->boolean('air_conditioning')->default(false);
                $table->string('usage_type')->nullable(); // Marchandise, Personnel, etc.
                $table->timestamps();
            });
        }

        // Drivers / Chauffeurs
        if (!Schema::hasTable('listing_drivers')) {
            Schema::create('listing_drivers', function (Blueprint $table) {
                $table->id();
                $table->foreignId('listing_id')->constrained()->cascadeOnDelete();
                $table->string('license_type')->nullable(); // Permis B, C, D, etc.
                $table->integer('experience_years')->nullable();
                $table->boolean('is_available')->default(true);
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('listing_drivers');
        Schema::dropIfExists('listing_transports');
        Schema::dropIfExists('listing_machineries');
        // Do not drop listing_cars if it existed before, but for now we assume we own it
        Schema::dropIfExists('listing_cars');
    }
};
