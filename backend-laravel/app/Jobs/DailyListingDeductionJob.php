<?php

namespace App\Jobs;

use App\Models\Listing;
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
     * Create a new job instance.
     */
    public function __construct()
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
    public function handle(): void
    {
        Log::info('Starting daily listing deduction dispatch');

        $dispatchCount = 0;

        // Dispatch child jobs for active listings in chunks
        Listing::where('status', 'active')
            ->select('id', 'status') // Keep it lightweight
            ->chunkById(100, function ($listings) use (&$dispatchCount) {
                foreach ($listings as $listing) {
                    ProcessListingDeductionJob::dispatch($listing)
                        ->onQueue((string) config('queue.defaults.billing_queue', 'billing'));
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
