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
        Schema::table('wallets', function (Blueprint $table) {
            // Note: We don't drop the index if it exists because the unique() helper
            // will throw if there's already a non-unique index or naming conflict.
            // In a clean Laravel setup, this will add the unique constraint.
            $table->unique('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('wallets', function (Blueprint $table) {
            $table->dropUnique(['user_id']);
        });
    }
};
