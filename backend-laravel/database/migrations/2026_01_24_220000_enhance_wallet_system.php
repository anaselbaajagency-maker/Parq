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
        // Modify wallets table
        Schema::table('wallets', function (Blueprint $table) {
            // Change balance to integer (credits are whole numbers)
            $table->integer('balance')->default(0)->change();
            // Rename currency to currency_label
            $table->renameColumn('currency', 'currency_label');
        });

        // Update default value for currency_label
        Schema::table('wallets', function (Blueprint $table) {
            $table->string('currency_label')->default('SOLD DIRHAM')->change();
        });

        // Modify wallet_transactions table
        Schema::table('wallet_transactions', function (Blueprint $table) {
            // Drop the old type enum
            $table->dropColumn('type');
        });

        Schema::table('wallet_transactions', function (Blueprint $table) {
            // Add new type with more options
            $table->string('type')->after('wallet_id'); // bonus, topup_manual, online_payment, deduction, coupon, admin_credit
            // Add source column
            $table->string('source')->default('system')->after('type'); // system, bank_transfer, cmi, payzone, cashplus, admin
            // Change amount to integer
            $table->integer('amount')->change();
            // Make description nullable
            $table->string('description')->nullable()->change();
        });

        // Create coupons table
        Schema::create('coupons', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->integer('credit_amount');
            $table->integer('max_uses')->default(1);
            $table->integer('used_count')->default(0);
            $table->timestamp('expires_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // Create topup_requests table
        Schema::create('topup_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->integer('amount');
            $table->string('method'); // bank_transfer, cmi, payzone, cashplus
            $table->string('status')->default('pending'); // pending, approved, rejected, processing
            $table->string('proof_image')->nullable();
            $table->string('payment_reference')->nullable();
            $table->text('admin_notes')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
        });

        // Create payment_methods table
        Schema::create('payment_methods', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->string('name_ar')->nullable();
            $table->text('description')->nullable();
            $table->text('description_ar')->nullable();
            $table->boolean('is_active')->default(true);
            $table->json('config')->nullable();
            $table->integer('sort_order')->default(0);
            $table->string('icon')->nullable();
            $table->timestamps();
        });

        // Create coupon_user pivot table to track which users have used which coupons
        Schema::create('coupon_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('coupon_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->timestamp('used_at');
            $table->unique(['coupon_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('coupon_user');
        Schema::dropIfExists('payment_methods');
        Schema::dropIfExists('topup_requests');
        Schema::dropIfExists('coupons');

        // Revert wallet_transactions
        Schema::table('wallet_transactions', function (Blueprint $table) {
            $table->dropColumn(['source']);
        });

        Schema::table('wallet_transactions', function (Blueprint $table) {
            $table->dropColumn('type');
        });

        Schema::table('wallet_transactions', function (Blueprint $table) {
            $table->enum('type', ['credit', 'debit'])->after('wallet_id');
            $table->decimal('amount', 10, 2)->change();
            $table->string('description')->nullable(false)->change();
        });

        // Revert wallets
        Schema::table('wallets', function (Blueprint $table) {
            $table->renameColumn('currency_label', 'currency');
        });

        Schema::table('wallets', function (Blueprint $table) {
            $table->decimal('balance', 10, 2)->default(0)->change();
            $table->string('currency')->default('MAD')->change();
        });
    }
};
