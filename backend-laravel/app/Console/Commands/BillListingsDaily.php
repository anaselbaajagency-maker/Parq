<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Listing;
use App\Models\Transaction;
use App\Notifications\InsufficientWalletBalanceNotification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class BillListingsDaily extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'listings:bill-daily';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Deduct daily costs for active listings from users wallets';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting daily listing billing process...');

        // Find all users who have at least one active listing
        $users = User::whereHas('listings', function ($query) {
            $query->where('status', 'active');
        })->with(['wallet', 'listings' => function ($query) {
            $query->where('status', 'active');
        }])->get();

        $processedUsers = 0;
        $pausedListingsCount = 0;

        foreach ($users as $user) {
            if (!$user->wallet) {
                continue; // User has no wallet setup for some reason
            }

            // Calculate total daily cost for this user's active listings
            $totalDailyCost = $user->listings->sum('daily_cost');

            if ($totalDailyCost <= 0) {
                continue; // Free listings, no deduction needed
            }

            DB::beginTransaction();
            try {
                if ($user->wallet->balance >= $totalDailyCost) {
                    // Success: Deduct balance
                    $user->wallet->balance -= $totalDailyCost;
                    $user->wallet->save();

                    // Create a transaction record
                    Transaction::create([
                        'user_id' => $user->id,
                        'wallet_id' => $user->wallet->id,
                        'type' => 'withdrawal',
                        'amount' => $totalDailyCost,
                        'description' => 'Déduction quotidienne pour vos annonces actives',
                        'status' => 'completed',
                        'reference' => 'BILL-' . now()->format('Ymd') . '-' . $user->id
                    ]);

                } else {
                    // Fail: Insufficient balance -> Pause listings and notify
                    foreach ($user->listings as $listing) {
                        $listing->status = 'paused';
                        $listing->save();
                        $pausedListingsCount++;
                    }

                    // Optional: empty whatever is left in the balance or leave it as is.
                    // Let's leave their remaining tiny balance alone since it wasn't enough.

                    // Send email notification
                    try {
                        $user->notify(new InsufficientWalletBalanceNotification());
                    } catch (\Exception $e) {
                        Log::error("Failed to send balance notification to User ID {$user->id}: " . $e->getMessage());
                    }

                    Log::info("User ID {$user->id} listings paused due to insufficient balance. Required: {$totalDailyCost}, Had: {$user->wallet->balance}");
                }

                DB::commit();
                $processedUsers++;

            } catch (\Exception $e) {
                DB::rollBack();
                Log::error("Failed to bill user ID {$user->id}: " . $e->getMessage());
                $this->error("Failed to process user ID {$user->id}");
            }
        }

        $this->info("Billing complete. Processed $processedUsers users. Paused $pausedListingsCount listings.");
    }
}
