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
    public function handle(): void
    {
        Log::info('Starting daily listing deduction dispatch');

        $dispatchCount = 0;

        // Dispatch child jobs for active listings in chunks
        Listing::where('status', 'active')
            ->select('id', 'status') // Keep it lightweight
            ->chunkById(100, function ($listings) use (&$dispatchCount) {
                foreach ($listings as $listing) {
                    ProcessListingDeductionJob::dispatch($listing);
                    $dispatchCount++;
                }
            });

        Log::info('Daily listing deduction dispatch completed', [
            'dispatched' => $dispatchCount,
        ]);
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('Daily listing deduction dispatcher failed: '.$exception->getMessage(), [
            'exception' => $exception,
        ]);
    }
}
