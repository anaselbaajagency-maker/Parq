<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Carbon\Carbon;

class Coupon extends Model
{
    protected $fillable = [
        'code',
        'credit_amount',
        'max_uses',
        'used_count',
        'expires_at',
        'is_active',
        'description',
    ];

    protected $casts = [
        'credit_amount' => 'integer',
        'max_uses' => 'integer',
        'used_count' => 'integer',
        'expires_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    /**
     * Get all users who have used this coupon.
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'coupon_user')
            ->withPivot('used_at')
            ->withTimestamps();
    }

    /**
     * Check if the coupon has expired.
     */
    public function isExpired(): bool
    {
        if (!$this->expires_at) {
            return false;
        }
        return $this->expires_at->isPast();
    }

    /**
     * Check if the coupon has reached its usage limit.
     */
    public function hasReachedLimit(): bool
    {
        return $this->used_count >= $this->max_uses;
    }

    /**
     * Check if the coupon is currently valid.
     */
    public function isValid(): bool
    {
        return $this->is_active && !$this->isExpired() && !$this->hasReachedLimit();
    }

    /**
     * Check if a specific user can use this coupon.
     */
    public function canBeUsedBy(User $user): bool
    {
        if (!$this->isValid()) {
            return false;
        }

        // Check if user has already used this coupon
        return !$this->users()->where('user_id', $user->id)->exists();
    }

    /**
     * Mark the coupon as used by a user.
     */
    public function markAsUsedBy(User $user): void
    {
        $this->users()->attach($user->id, ['used_at' => now()]);
        $this->increment('used_count');
    }

    /**
     * Get remaining uses.
     */
    public function getRemainingUsesAttribute(): int
    {
        return max(0, $this->max_uses - $this->used_count);
    }

    /**
     * Scope to get only active coupons.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to get only valid (active, not expired, not fully used) coupons.
     */
    public function scopeValid($query)
    {
        return $query->where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            })
            ->whereRaw('used_count < max_uses');
    }

    /**
     * Find a coupon by its code.
     */
    public static function findByCode(string $code): ?self
    {
        return static::where('code', strtoupper(trim($code)))->first();
    }

    /**
     * Set the code attribute - always uppercase.
     */
    public function setCodeAttribute(string $value): void
    {
        $this->attributes['code'] = strtoupper(trim($value));
    }
}
