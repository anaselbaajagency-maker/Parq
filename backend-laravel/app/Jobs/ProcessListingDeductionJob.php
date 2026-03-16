<?php

namespace App\Jobs;

use App\Exceptions\InsufficientBalanceException;
use App\Models\Listing;
use App\Notifications\ListingHiddenNotification;
use App\Notifications\LowBalanceNotification;
use App\Services\WalletService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessListingDeductionJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(protected Listing $listing)
    {
        $this->onQueue((string) config('queue.defaults.billing_queue', 'billing'));
    }

    public function tries(): int
    {
        return max((int) config('queue.defaults.tries', 3), 1);
    }

    public function backoff(): array
    {
        $baseBackoff = max((int) config('queue.defaults.backoff_seconds', 60), 1);

        return [
            $baseBackoff,
            $baseBackoff * 5,
            $baseBackoff * 15,
        ];
    }

    /**
     * Execute the job.
     */
    public function handle(WalletService $walletService): void
    {
        // Refresh listing from DB to ensure status is still active
        $this->listing->refresh();

        if ($this->listing->status !== 'active') {
            return;
        }

        // Get daily cost from category, or use default from config
        $dailyCost = $this->listing->category?->daily_cost ?? config('wallet.default_daily_cost', 5);

        // Skip if no cost
        if ($dailyCost <= 0) {
            return;
        }

        try {
            $walletService->deduct(
                $this->listing->user,
                $dailyCost,
                "Frais quotidien: {$this->listing->title}",
                $this->listing,
                [
                    'listing_id' => $this->listing->id,
                    'category_id' => $this->listing->category_id,
                    'deduction_date' => now()->toDateString(),
                ]
            );

            Log::debug("Deducted {$dailyCost} from user {$this->listing->user_id} for listing {$this->listing->id}");

            // Check if balance is low and notify
            $this->checkLowBalance($this->listing->user, $walletService);

        } catch (InsufficientBalanceException $e) {
            Log::warning("Insufficient balance for listing {$this->listing->id}, hiding listing", [
                'user_id' => $this->listing->user_id,
                'required' => $dailyCost,
                'balance' => $walletService->getBalance($this->listing->user),
            ]);

            // Hide the listing
            $this->listing->update(['status' => 'hidden']);

            // Notify user
            $this->notifyListingHidden($this->listing);

        } catch (\Exception $e) {
            Log::error("Error processing listing {$this->listing->id}: ".$e->getMessage(), [
                'exception' => $e,
            ]);
            throw $e; // Rethrow for queue retry
        }
    }

    /**
     * Notify user that their listing was hidden.
     */
    protected function notifyListingHidden(Listing $listing): void
    {
        try {
            $listing->user->notify(new ListingHiddenNotification($listing));
        } catch (\Exception $e) {
            Log::error('Failed to send listing hidden notification: '.$e->getMessage());
        }
    }

    /**
     * Check if user has low balance and send notification.
     */
    protected function checkLowBalance($user, WalletService $walletService): void
    {
        $balance = $walletService->getBalance($user);
        $threshold = config('wallet.low_balance_threshold', 20);

        if ($balance <= $threshold && $balance > 0) {
            try {
                $user->notify(new LowBalanceNotification($balance));
            } catch (\Exception $e) {
                Log::error('Failed to send low balance notification: '.$e->getMessage());
            }
        }
    }

    public function failed(\Throwable $exception): void
    {
        Log::error('ProcessListingDeductionJob moved to dead-letter queue', [
            'listing_id' => $this->listing->id ?? null,
            'user_id' => $this->listing->user_id ?? null,
            'message' => $exception->getMessage(),
        ]);
    }
}
