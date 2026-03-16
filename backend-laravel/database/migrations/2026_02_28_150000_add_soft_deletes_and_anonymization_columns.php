<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('users', 'anonymized_at')) {
            Schema::table('users', function (Blueprint $table) {
                $table->timestamp('anonymized_at')->nullable();
            });
        }

        if (! Schema::hasColumn('users', 'deleted_at')) {
            Schema::table('users', function (Blueprint $table) {
                $table->softDeletes();
            });
        }

        if (! Schema::hasColumn('listings', 'deleted_at')) {
            Schema::table('listings', function (Blueprint $table) {
                $table->softDeletes();
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('listings', 'deleted_at')) {
            Schema::table('listings', function (Blueprint $table) {
                $table->dropSoftDeletes();
            });
        }

        if (Schema::hasColumn('users', 'deleted_at')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropSoftDeletes();
            });
        }

        if (Schema::hasColumn('users', 'anonymized_at')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('anonymized_at');
            });
        }
    }
};
