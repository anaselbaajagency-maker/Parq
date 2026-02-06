<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class WalletTransaction extends Model
{
    // Transaction Types
    const TYPE_BONUS = 'bonus';
    const TYPE_TOPUP_MANUAL = 'topup_manual';
    const TYPE_ONLINE_PAYMENT = 'online_payment';
    const TYPE_DEDUCTION = 'deduction';
    const TYPE_COUPON = 'coupon';
    const TYPE_ADMIN_CREDIT = 'admin_credit';

    // Transaction Sources
    const SOURCE_SYSTEM = 'system';
    const SOURCE_BANK_TRANSFER = 'bank_transfer';
    const SOURCE_CMI = 'cmi';
    const SOURCE_PAYZONE = 'payzone';
    const SOURCE_CASHPLUS = 'cashplus';
    const SOURCE_ADMIN = 'admin';

    protected $fillable = [
        'wallet_id',
        'type',
        'source',
        'amount',
        'description',
        'reference_type',
        'reference_id',
        'metadata',
    ];

    protected $casts = [
        'amount' => 'integer',
        'metadata' => 'array',
    ];

    /**
     * Get the wallet this transaction belongs to.
     */
    public function wallet(): BelongsTo
    {
        return $this->belongsTo(Wallet::class);
    }

    /**
     * Get the related reference model (listing, coupon, etc.)
     */
    public function reference(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Check if this is a credit transaction.
     */
    public function isCredit(): bool
    {
        return $this->amount > 0;
    }

    /**
     * Check if this is a debit transaction.
     */
    public function isDebit(): bool
    {
        return $this->amount < 0;
    }

    /**
     * Get the formatted amount with sign.
     */
    public function getFormattedAmountAttribute(): string
    {
        $sign = $this->amount > 0 ? '+' : '';
        return $sign . $this->amount . ' ' . config('wallet.currency_label', 'SOLD DIRHAM');
    }

    /**
     * Get the type label for display.
     */
    public function getTypeLabelAttribute(): string
    {
        return config("wallet.transaction_types.{$this->type}", $this->type);
    }

    /**
     * Get the source label for display.
     */
    public function getSourceLabelAttribute(): string
    {
        return config("wallet.transaction_sources.{$this->source}", $this->source);
    }

    /**
     * Scope to filter by type.
     */
    public function scopeOfType($query, string $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope to filter credits only.
     */
    public function scopeCredits($query)
    {
        return $query->where('amount', '>', 0);
    }

    /**
     * Scope to filter debits only.
     */
    public function scopeDebits($query)
    {
        return $query->where('amount', '<', 0);
    }

    /**
     * Get all valid transaction types.
     */
    public static function getTypes(): array
    {
        return [
            self::TYPE_BONUS,
            self::TYPE_TOPUP_MANUAL,
            self::TYPE_ONLINE_PAYMENT,
            self::TYPE_DEDUCTION,
            self::TYPE_COUPON,
            self::TYPE_ADMIN_CREDIT,
        ];
    }

    /**
     * Get all valid transaction sources.
     */
    public static function getSources(): array
    {
        return [
            self::SOURCE_SYSTEM,
            self::SOURCE_BANK_TRANSFER,
            self::SOURCE_CMI,
            self::SOURCE_PAYZONE,
            self::SOURCE_CASHPLUS,
            self::SOURCE_ADMIN,
        ];
    }
}
