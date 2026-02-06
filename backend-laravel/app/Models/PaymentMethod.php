<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentMethod extends Model
{
    protected $fillable = [
        'code',
        'name',
        'name_ar',
        'description',
        'description_ar',
        'is_active',
        'config',
        'sort_order',
        'icon',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'config' => 'array',
        'sort_order' => 'integer',
    ];

    protected $hidden = [
        'config', // Hide sensitive config data from API responses
    ];

    /**
     * Scope to get only active payment methods.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to order by sort order.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order', 'asc');
    }

    /**
     * Get a config value.
     */
    public function getConfigValue(string $key, $default = null)
    {
        return $this->config[$key] ?? $default;
    }

    /**
     * Check if this method requires proof upload.
     */
    public function requiresProof(): bool
    {
        return $this->code === 'bank_transfer';
    }

    /**
     * Check if this method uses online payment.
     */
    public function isOnlinePayment(): bool
    {
        return in_array($this->code, ['cmi', 'payzone']);
    }

    /**
     * Find a payment method by its code.
     */
    public static function findByCode(string $code): ?self
    {
        return static::where('code', $code)->first();
    }

    /**
     * Get the name in the specified locale.
     */
    public function getLocalizedName(string $locale = 'fr'): string
    {
        if ($locale === 'ar' && $this->name_ar) {
            return $this->name_ar;
        }
        return $this->name;
    }

    /**
     * Get the description in the specified locale.
     */
    public function getLocalizedDescription(string $locale = 'fr'): ?string
    {
        if ($locale === 'ar' && $this->description_ar) {
            return $this->description_ar;
        }
        return $this->description;
    }
}
