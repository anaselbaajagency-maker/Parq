<?php

namespace App\Services;

use App\Exceptions\InsufficientBalanceException;
use App\Exceptions\InvalidCouponException;
use App\Models\Coupon;
use App\Models\User;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class WalletService
{
    /**
     * Create a new wallet for a user.
     */
    public function createWallet(User $user): Wallet
    {
        return Wallet::create([
            'user_id' => $user->id,
            'balance' => 0,
            'currency_label' => config('wallet.currency_label', 'SOLD DIRHAM'),
        ]);
    }

    /**
     * Create a wallet with registration bonus.
     */
    public function createWalletWithBonus(User $user, ?int $bonusAmount = null): Wallet
    {
        $bonusAmount = $bonusAmount ?? config('wallet.registration_bonus', 100);

        return DB::transaction(function () use ($user, $bonusAmount) {
            // Check if wallet already exists
            if ($user->wallet) {
                return $user->wallet;
            }

            // Create wallet
            $wallet = $this->createWallet($user);

            // Credit bonus if amount > 0
            if ($bonusAmount > 0) {
                $wallet->increment('balance', $bonusAmount);

                $wallet->transactions()->create([
                    'type' => WalletTransaction::TYPE_BONUS,
                    'source' => WalletTransaction::SOURCE_SYSTEM,
                    'amount' => $bonusAmount,
                    'description' => 'Bonus de bienvenue',
                ]);
            }

            return $wallet->fresh();
        });
    }

    /**
     * Get or create wallet for a user.
     */
    public function getOrCreateWallet(User $user): Wallet
    {
        return $user->wallet ?? $this->createWallet($user);
    }

    /**
     * Credit amount to user's wallet.
     */
    public function credit(
        User $user,
        int $amount,
        string $type,
        string $source,
        string $description,
        $reference = null,
        ?array $metadata = null
    ): WalletTransaction {
        if ($amount <= 0) {
            throw new \InvalidArgumentException('Credit amount must be positive');
        }

        return DB::transaction(function () use ($user, $amount, $type, $source, $description, $reference, $metadata) {
            $wallet = $this->getOrCreateWallet($user);
            $wallet->increment('balance', $amount);

            return $wallet->transactions()->create([
                'type' => $type,
                'source' => $source,
                'amount' => $amount, // Positive for credit
                'description' => $description,
                'reference_type' => $reference ? get_class($reference) : null,
                'reference_id' => $reference?->id,
                'metadata' => $metadata,
            ]);
        });
    }

    /**
     * Deduct amount from user's wallet.
     *
     * @throws InsufficientBalanceException
     */
    public function deduct(
        User $user,
        int $amount,
        string $description,
        $reference = null,
        ?array $metadata = null
    ): WalletTransaction {
        if ($amount <= 0) {
            throw new \InvalidArgumentException('Deduction amount must be positive');
        }

        return DB::transaction(function () use ($user, $amount, $description, $reference, $metadata) {
            $wallet = $this->getOrCreateWallet($user);

            // Lock the wallet row for update
            $wallet = Wallet::where('id', $wallet->id)->lockForUpdate()->first();

            if (! $wallet->hasEnoughBalance($amount)) {
                throw new InsufficientBalanceException(
                    "Solde insuffisant. Requis: {$amount}, Disponible: {$wallet->balance}"
                );
            }

            $wallet->decrement('balance', $amount);

            return $wallet->transactions()->create([
                'type' => WalletTransaction::TYPE_DEDUCTION,
                'source' => WalletTransaction::SOURCE_SYSTEM,
                'amount' => -$amount, // Negative for deduction
                'description' => $description,
                'reference_type' => $reference ? get_class($reference) : null,
                'reference_id' => $reference?->id,
                'metadata' => $metadata,
            ]);
        });
    }

    /**
     * Get the current balance for a user.
     */
    public function getBalance(User $user): int
    {
        return $user->wallet?->balance ?? 0;
    }

    /**
     * Get formatted balance with currency label.
     */
    public function getFormattedBalance(User $user): string
    {
        $wallet = $this->getOrCreateWallet($user);

        return $wallet->formatted_balance;
    }

    /**
     * Get transaction history for a user.
     */
    public function getTransactionHistory(User $user, int $limit = 20, int $offset = 0): Collection
    {
        $wallet = $user->wallet;

        if (! $wallet) {
            return collect();
        }

        return $wallet->transactions()
            ->orderBy('created_at', 'desc')
            ->skip($offset)
            ->take($limit)
            ->get();
    }

    /**
     * Get transactions by type.
     */
    public function getTransactionsByType(User $user, string $type, int $limit = 20): Collection
    {
        $wallet = $user->wallet;

        if (! $wallet) {
            return collect();
        }

        $query = $wallet->transactions()
            ->orderBy('created_at', 'desc');

        if ($type === 'credit') {
            $query->credits();
        } elseif ($type === 'debit') {
            $query->debits();
        } else {
            $query->where('type', $type);
        }

        return $query->take($limit)->get();
    }

    /**
     * Redeem a coupon code.
     *
     * @throws InvalidCouponException
     */
    public function redeemCoupon(User $user, string $code): WalletTransaction
    {
        $coupon = Coupon::findByCode($code);

        if (! $coupon) {
            throw new InvalidCouponException('Code coupon invalide');
        }

        if (! $coupon->isValid()) {
            if ($coupon->isExpired()) {
                throw new InvalidCouponException('Ce coupon a expiré');
            }
            if ($coupon->hasReachedLimit()) {
                throw new InvalidCouponException('Ce coupon a atteint sa limite d\'utilisation');
            }
            throw new InvalidCouponException('Ce coupon n\'est plus valide');
        }

        if (! $coupon->canBeUsedBy($user)) {
            throw new InvalidCouponException('Vous avez déjà utilisé ce coupon');
        }

        return DB::transaction(function () use ($user, $coupon) {
            // Mark coupon as used
            $coupon->markAsUsedBy($user);

            // Credit the wallet
            return $this->credit(
                $user,
                $coupon->credit_amount,
                WalletTransaction::TYPE_COUPON,
                WalletTransaction::SOURCE_SYSTEM,
                "Coupon: {$coupon->code}",
                $coupon,
                ['coupon_code' => $coupon->code]
            );
        });
    }

    /**
     * Admin credit - for manual wallet adjustments.
     */
    public function adminCredit(
        User $user,
        int $amount,
        string $description,
        User $admin,
        ?array $metadata = null
    ): WalletTransaction {
        $metadata = array_merge($metadata ?? [], [
            'admin_id' => $admin->id,
            'admin_name' => $admin->full_name,
        ]);

        return $this->credit(
            $user,
            $amount,
            WalletTransaction::TYPE_ADMIN_CREDIT,
            WalletTransaction::SOURCE_ADMIN,
            $description,
            null,
            $metadata
        );
    }

    /**
     * Check if user can afford a certain amount.
     */
    public function canAfford(User $user, int $amount): bool
    {
        return $this->getBalance($user) >= $amount;
    }

    /**
     * Get total credits earned by user.
     */
    public function getTotalCredits(User $user): int
    {
        return $user->wallet?->transactions()
            ->where('amount', '>', 0)
            ->sum('amount') ?? 0;
    }

    /**
     * Get total debits/spending by user.
     */
    public function getTotalDebits(User $user): int
    {
        return abs($user->wallet?->transactions()
            ->where('amount', '<', 0)
            ->sum('amount') ?? 0);
    }

    /**
     * Calculate daily expense based on active listings daily cost.
     */
    public function getDailyExpense(User $user): float
    {
        // Sum daily_cost of all active listings
        return (float) $user->listings()
            ->where('status', 'active')
            ->sum('daily_cost');
    }

    /**
     * Calculate days remaining based on balance and daily expense.
     */
    public function getDaysRemaining(User $user): int
    {
        $dailyExpense = $this->getDailyExpense($user);
        $balance = $this->getBalance($user);

        if ($dailyExpense <= 0) {
            return 999; // Infinite days if no expense
        }

        return (int) floor($balance / $dailyExpense);
    }
}
