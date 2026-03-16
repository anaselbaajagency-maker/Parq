<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\City;
use App\Models\Listing;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminListingRejectionTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_reject_listing_with_reason()
    {
        // 1. Setup
        $admin = User::factory()->create(['role' => 'admin']);
        $owner = User::factory()->create();
        $category = Category::create(['name' => 'Test', 'slug' => 'test', 'type' => 'machinery']);
        $city = City::create(['name' => 'Loc', 'slug' => 'loc']);

        $listing = Listing::create([
            'user_id' => $owner->id,
            'category_id' => $category->id,
            'city_id' => $city->id,
            'title' => 'Pending Listing',
            'slug' => 'pending-listing',
            'price' => 100,
            'status' => 'pending',
            'price_unit' => 'DH',
        ]);

        // 2. Action: Admin rejects
        Sanctum::actingAs($admin);
        $response = $this->postJson("/api/admin/listings/{$listing->id}/reject", [
            'reason' => 'Photo non claire'
        ]);

        // 3. Assertions
        $response->assertStatus(200);
        $response->assertJsonFragment(['status' => 'rejected', 'rejection_reason' => 'Photo non claire']);
        
        $this->assertDatabaseHas('listings', [
            'id' => $listing->id,
            'status' => 'rejected',
            'rejection_reason' => 'Photo non claire'
        ]);
    }

    public function test_reject_requires_reason()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $owner = User::factory()->create();
        $category = Category::create(['name' => 'Test', 'slug' => 'test', 'type' => 'machinery']);
        $listing = Listing::create([
            'user_id' => $owner->id,
            'category_id' => $category->id,
            'title' => 'Pending',
            'slug' => 'pending',
            'price' => 100,
            'status' => 'pending',
            'price_unit' => 'DH',
        ]);

        Sanctum::actingAs($admin);
        $response = $this->postJson("/api/admin/listings/{$listing->id}/reject", []);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['reason']);
    }
}
