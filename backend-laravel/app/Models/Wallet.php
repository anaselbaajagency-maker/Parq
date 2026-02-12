<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Wallet extends Model
{
    protected $fillable = [
        'user_id',
        'balance',
        'currency_label',
    ];

    protected $casts = [
        'balance' => 'integer',
    ];

    protected $attributes = [
        'balance' => 0,
        'currency_label' => 'SOLD DIRHAM',
    ];

    /**
     * Get the user that owns the wallet.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get all transactions for the wallet.
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(WalletTransaction::class)->orderBy('created_at', 'desc');
    }

    /**
     * Check if wallet has enough balance for a transaction.
     */
    public function hasEnoughBalance(int $amount): bool
    {
        return $this->balance >= $amount;
    }

    /**
     * Get the formatted balance with currency label.
     */
    public function getFormattedBalanceAttribute(): string
    {
        return $this->balance.' '.$this->currency_label;
    }

    /**
     * Get balance in MAD (based on conversion rate).
     */
    public function getBalanceInMadAttribute(): float
    {
        return $this->balance * config('wallet.conversion_rate', 1);
    }

    /**
     * Scope to find wallet with low balance.
     */
    public function scopeLowBalance($query, int $threshold = 10)
    {
        return $query->where('balance', '<=', $threshold);
    }
}
