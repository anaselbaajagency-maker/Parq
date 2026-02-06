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
        Schema::table('listings', function (Blueprint $table) {
            $table->decimal('daily_cost', 10, 2)->nullable()->after('status'); // Snapshot of category cost
            $table->string('price_type')->default('daily')->after('price'); // daily, hourly, mission, call
            $table->boolean('is_featured')->default(false)->after('daily_cost');
            $table->decimal('latitude', 10, 8)->nullable()->after('location');
            $table->decimal('longitude', 11, 8)->nullable()->after('latitude');
            $table->timestamp('published_at')->nullable()->after('updated_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('listings', function (Blueprint $table) {
            $table->dropColumn(['daily_cost', 'price_type', 'is_featured', 'latitude', 'longitude', 'published_at']);
        });
    }
};
