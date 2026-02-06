<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Services\WalletService;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'full_name',
        'email',
        'password',
        'google_id',
        'phone',
        'avatar',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Boot the model.
     */
    protected static function booted(): void
    {
        static::created(function (User $user) {
            // Auto-create wallet with bonus for new users
            app(WalletService::class)->createWalletWithBonus($user);
        });
    }

    /**
     * Get the user's listings.
     */
    public function listings(): HasMany
    {
        return $this->hasMany(Listing::class);
    }

    /**
     * Get the user's bookings.
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    /**
     * Get bookings received by this user (as provider).
     */
    public function receivedBookings(): HasMany
    {
        return $this->hasMany(Booking::class, 'provider_id');
    }

    /**
     * Get the user's wallet.
     */
    public function wallet(): HasOne
    {
        return $this->hasOne(Wallet::class);
    }

    /**
     * Get the user's reviews.
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Get messages sent by the user.
     */
    public function sentMessages(): HasMany
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    /**
     * Get messages received by the user.
     */
    public function receivedMessages(): HasMany
    {
        return $this->hasMany(Message::class, 'receiver_id');
    }

    /**
     * Get the user's top-up requests.
     */
    public function topUpRequests(): HasMany
    {
        return $this->hasMany(TopUpRequest::class);
    }

    /**
     * Get the user's coupons used.
     */
    public function usedCoupons()
    {
        return $this->belongsToMany(Coupon::class, 'coupon_user')
            ->withPivot('used_at')
            ->withTimestamps();
    }

    /**
     * Check if user is an admin.
     */
    public function isAdmin(): bool
    {
        return strtoupper($this->role) === 'ADMIN';
    }

    /**
     * Get the user's favorite listings.
     */
    public function favorites()
    {
        return $this->belongsToMany(Listing::class, 'favorites', 'user_id', 'listing_id')->withTimestamps();
    }

    /**
     * Get the user's wallet balance.
     */
    public function getWalletBalanceAttribute(): int
    {
        return $this->wallet?->balance ?? 0;
    }
}
