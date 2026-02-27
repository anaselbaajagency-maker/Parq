<?php

namespace Tests\Feature;

use App\Jobs\DailyListingDeductionJob;
use App\Jobs\ProcessListingDeductionJob;
use App\Models\Category;
use App\Models\Listing;
use App\Models\User;
use App\Models\Wallet;
use App\Services\WalletService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Bus;
use Tests\TestCase;

class WalletDeductionTest extends TestCase
{
    use RefreshDatabase;

    public function test_daily_deduction_job_dispatches_child_jobs()
    {
        Bus::fake();

        $category = Category::create([
            'name' => 'General',
            'slug' => 'general',
            'type' => 'rent'
        ]);
        
        $user = User::factory()->create();
        
        // Create 5 active listings
        for ($i = 0; $i < 5; $i++) {
            Listing::create([
                'user_id' => $user->id,
                'category_id' => $category->id,
                'title' => "Active Listing $i",
                'slug' => "active-listing-$i",
                'status' => 'active',
                'price' => 100,
                'price_unit' => 'DH/day'
            ]);
        }
        
        // Create 2 inactive listings
        for ($i = 0; $i < 2; $i++) {
            Listing::create([
                'user_id' => $user->id,
                'category_id' => $category->id,
                'title' => "Pending Listing $i",
                'slug' => "pending-listing-$i",
                'status' => 'pending',
                'price' => 100,
                'price_unit' => 'DH/day'
            ]);
        }

        (new DailyListingDeductionJob())->handle();

        Bus::assertDispatched(ProcessListingDeductionJob::class, 5);
    }

    public function test_process_listing_deduction_job_deducts_successfully()
    {
        $category = Category::create([
            'name' => 'Test Category',
            'slug' => 'test-category',
            'type' => 'rent',
            'daily_cost' => 10
        ]);
        
        $user = User::factory()->create();
        $wallet = Wallet::where('user_id', $user->id)->first();
        if (!$wallet) {
            $wallet = Wallet::create([
                'user_id' => $user->id,
                'balance' => 100,
                'currency_label' => 'SOLD DIRHAM'
            ]);
        } else {
            $wallet->update(['balance' => 100]);
        }
        
        $listing = Listing::create([
            'user_id' => $user->id,
            'category_id' => $category->id,
            'status' => 'active',
            'title' => 'Test Listing',
            'slug' => 'test-listing',
            'price' => 100,
            'price_unit' => 'DH/day'
        ]);

        $walletService = app(WalletService::class);
        (new ProcessListingDeductionJob($listing))->handle($walletService);

        $this->assertEquals(90, $user->fresh()->wallet->balance);
        $this->assertEquals('active', $listing->fresh()->status);
    }

    public function test_process_listing_deduction_job_hides_listing_on_insufficient_balance()
    {
        $category = Category::create([
            'name' => 'Expensive Category',
            'slug' => 'expensive-category',
            'type' => 'rent',
            'daily_cost' => 50
        ]);
        
        $user = User::factory()->create();
        $wallet = Wallet::where('user_id', $user->id)->first();
        if (!$wallet) {
            $wallet = Wallet::create([
                'user_id' => $user->id,
                'balance' => 10,
                'currency_label' => 'SOLD DIRHAM'
            ]);
        } else {
            $wallet->update(['balance' => 10]);
        }
        
        $listing = Listing::create([
            'user_id' => $user->id,
            'category_id' => $category->id,
            'status' => 'active',
            'title' => 'Expensive Listing',
            'slug' => 'expensive-listing',
            'price' => 100,
            'price_unit' => 'DH/day'
        ]);

        $walletService = app(WalletService::class);
        (new ProcessListingDeductionJob($listing))->handle($walletService);

        // Balance should remain the same (failed deduction)
        $this->assertEquals(10, $user->fresh()->wallet->balance);
        // Listing should be hidden
        $this->assertEquals('hidden', $listing->fresh()->status);
    }
}
