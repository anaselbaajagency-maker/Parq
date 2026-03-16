<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('listings', function (Blueprint $table) {
            $table->index(['status', 'created_at'], 'listings_status_created_at_idx');
            $table->index(['status', 'category_id', 'city_id', 'created_at'], 'listings_status_cat_city_created_idx');
            $table->index(['status', 'price', 'created_at'], 'listings_status_price_created_idx');
            $table->index(['user_id', 'status', 'created_at'], 'listings_user_status_created_idx');
        });

        Schema::table('wallet_transactions', function (Blueprint $table) {
            $table->index(['wallet_id', 'type', 'created_at'], 'wallet_tx_wallet_type_created_idx');
            $table->index(['created_at'], 'wallet_tx_created_at_idx');
        });

        Schema::table('messages', function (Blueprint $table) {
            $table->index(['sender_id', 'receiver_id', 'created_at'], 'messages_sender_receiver_created_idx');
            $table->index(['receiver_id', 'read_at', 'created_at'], 'messages_receiver_read_created_idx');
        });

        Schema::table('bookings', function (Blueprint $table) {
            $table->index(['listing_id', 'status', 'start_date'], 'bookings_listing_status_start_idx');
            $table->index(['user_id', 'status', 'created_at'], 'bookings_user_status_created_idx');
            $table->index(['provider_id', 'status', 'created_at'], 'bookings_provider_status_created_idx');
        });

        Schema::table('topup_requests', function (Blueprint $table) {
            $table->index(['user_id', 'status', 'created_at'], 'topup_user_status_created_idx');
            $table->index(['status', 'created_at'], 'topup_status_created_idx');
        });
    }

    public function down(): void
    {
        Schema::table('topup_requests', function (Blueprint $table) {
            $table->dropIndex('topup_user_status_created_idx');
            $table->dropIndex('topup_status_created_idx');
        });

        Schema::table('bookings', function (Blueprint $table) {
            $table->dropIndex('bookings_listing_status_start_idx');
            $table->dropIndex('bookings_user_status_created_idx');
            $table->dropIndex('bookings_provider_status_created_idx');
        });

        Schema::table('messages', function (Blueprint $table) {
            $table->dropIndex('messages_sender_receiver_created_idx');
            $table->dropIndex('messages_receiver_read_created_idx');
        });

        Schema::table('wallet_transactions', function (Blueprint $table) {
            $table->dropIndex('wallet_tx_wallet_type_created_idx');
            $table->dropIndex('wallet_tx_created_at_idx');
        });

        Schema::table('listings', function (Blueprint $table) {
            $table->dropIndex('listings_status_created_at_idx');
            $table->dropIndex('listings_status_cat_city_created_idx');
            $table->dropIndex('listings_status_price_created_idx');
            $table->dropIndex('listings_user_status_created_idx');
        });
    }
};
