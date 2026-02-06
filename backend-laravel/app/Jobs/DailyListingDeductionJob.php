<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\Listing;
use App\Services\WalletService;
use App\Exceptions\InsufficientBalanceException;
use App\Notifications\ListingHiddenNotification;
use App\Notifications\LowBalanceNotification;
use Illuminate\Support\Facades\Log;

class DailyListingDeductionJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 3;

    /**
     * The number of seconds to wait before retrying the job.
     */
    public int $backoff = 60;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(WalletService $walletService): void
    {
        Log::info('Starting daily listing deduction job');

        $processedCount = 0;
        $hiddenCount = 0;
        $totalDeducted = 0;

        // Process listings in chunks to avoid memory issues
        Listing::where('status', 'active')
            ->with(['user.wallet', 'category'])
            ->chunk(100, function ($listings) use ($walletService, &$processedCount, &$hiddenCount, &$totalDeducted) {
                foreach ($listings as $listing) {
                    $result = $this->processListing($listing, $walletService);

                    if ($result['success']) {
                        $processedCount++;
                        $totalDeducted += $result['amount'];
                    } else {
                        $hiddenCount++;
                    }
                }
            });

        Log::info('Daily listing deduction completed', [
            'processed' => $processedCount,
            'hidden' => $hiddenCount,
            'total_deducted' => $totalDeducted,
        ]);
    }

    /**
     * Process a single listing.
     */
    protected function processListing(Listing $listing, WalletService $walletService): array
    {
        // Get daily cost from category, or use default from config
        $dailyCost = $listing->category?->daily_cost ?? config('wallet.default_daily_cost', 5);

        // Skip if no cost
        if ($dailyCost <= 0) {
            return ['success' => true, 'amount' => 0];
        }

        try {
            $walletService->deduct(
                $listing->user,
                $dailyCost,
                "Frais quotidien: {$listing->title}",
                $listing,
                [
                    'listing_id' => $listing->id,
                    'category_id' => $listing->category_id,
                    'deduction_date' => now()->toDateString(),
                ]
            );

            Log::debug("Deducted {$dailyCost} from user {$listing->user_id} for listing {$listing->id}");

            // Check if balance is low and notify
            $this->checkLowBalance($listing->user, $walletService);

            return ['success' => true, 'amount' => $dailyCost];

        } catch (InsufficientBalanceException $e) {
            Log::warning("Insufficient balance for listing {$listing->id}, hiding listing", [
                'user_id' => $listing->user_id,
                'required' => $dailyCost,
                'balance' => $walletService->getBalance($listing->user),
            ]);

            // Hide the listing
            $listing->update(['status' => 'hidden']);

            // Notify user
            $this->notifyListingHidden($listing);

            return ['success' => false, 'amount' => 0];

        } catch (\Exception $e) {
            Log::error("Error processing listing {$listing->id}: " . $e->getMessage(), [
                'exception' => $e,
            ]);

            return ['success' => false, 'amount' => 0];
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
            Log::error("Failed to send listing hidden notification: " . $e->getMessage());
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
                Log::error("Failed to send low balance notification: " . $e->getMessage());
            }
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('Daily listing deduction job failed: ' . $exception->getMessage(), [
            'exception' => $exception,
        ]);
    }
}
