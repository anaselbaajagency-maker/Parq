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
            if (! Schema::hasColumn('categories', 'description')) {
                $table->text('description')->nullable()->after('icon');
            }
            if (! Schema::hasColumn('categories', 'name_fr')) {
                $table->string('name_fr')->nullable()->after('name');
            }
            if (! Schema::hasColumn('categories', 'name_ar')) {
                $table->string('name_ar')->nullable()->after('name_fr');
            }
            if (! Schema::hasColumn('categories', 'description_fr')) {
                $table->text('description_fr')->nullable()->after('description');
            }
            if (! Schema::hasColumn('categories', 'description_ar')) {
                $table->text('description_ar')->nullable()->after('description_fr');
            }
        });

        Schema::table('cities', function (Blueprint $table) {
            if (! Schema::hasColumn('cities', 'name_fr')) {
                $table->string('name_fr')->nullable()->after('name');
            }
            if (! Schema::hasColumn('cities', 'name_ar')) {
                $table->string('name_ar')->nullable()->after('name_fr');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('categories_and_cities', function (Blueprint $table) {
            //
        });
    }
};
