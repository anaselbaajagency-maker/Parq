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
        Schema::table('categories', function (Blueprint $table) {
            $table->string('type')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // We cannot easily revert back to enum without risking data loss if non-enum values exist.
        // But for strict rollback:
        Schema::table('categories', function (Blueprint $table) {
            // $table->enum('type', ['rent', 'buy'])->default('rent')->change();
            // Keeping it as string on rollback is safer to avoid errors,
            // or we can allow it strictly if we are sure.
            // For now, let's just make it string in down as well to avoid breaking.
            $table->string('type')->change();
        });
    }
};
