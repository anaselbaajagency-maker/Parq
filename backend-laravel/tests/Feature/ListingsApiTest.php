<?php

namespace Tests\Feature;

use App\Jobs\OptimizeListingImagesJob;
use App\Models\Category;
use App\Models\City;
use App\Models\Listing;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Bus;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ListingsApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_listing_with_car_params()
    {
        Bus::fake([OptimizeListingImagesJob::class]);

        // 1. Setup Data
        $user = User::factory()->create();
        $category = Category::create([
            'name' => 'Voitures',
            'slug' => 'voitures',
            'type' => 'car_rental',
            'daily_cost' => 10,
        ]);
        $city = City::create(['name' => 'Casablanca', 'slug' => 'casablanca']);

        // 2. Action: Post Listing
        Sanctum::actingAs($user);
        $response = $this->postJson('/api/listings', [
            'category_id' => $category->id,
            'city_id' => $city->id,
            'title' => 'Golf 7 2020',
            'description' => 'Great car',
            'price' => 500,
            'fuel_type' => 'Diesel', // Specific field
            'gearbox' => 'Automatic', // Specific field
        ]);

        // 3. Assertions
        $response->assertStatus(201);
        $this->assertDatabaseHas('listings', ['title' => 'Golf 7 2020']);
        $this->assertDatabaseHas('listing_cars', [
            'fuel_type' => 'Diesel',
            'gearbox' => 'Automatic',
        ]);

        $listingId = $response->json('id');
        $this->assertNotNull($listingId);
    }

    public function test_can_fetch_listings_with_filters()
    {
        Bus::fake([OptimizeListingImagesJob::class]);

        $user = User::factory()->create();
        $category = Category::create([
            'name' => 'Machinery',
            'slug' => 'machinery',
            'type' => 'machinery',
            'daily_cost' => 20,
        ]);

        // Create active listing
        Sanctum::actingAs($user);
        $this->postJson('/api/listings', [
            'category_id' => $category->id,
            'title' => 'Cat Excavator',
            'price' => 2000,
            'brand' => 'Caterpillar',
            'model' => '320',
        ])->assertStatus(201);

        // Manually activate it since default is pending
        $listing = \App\Models\Listing::first();
        $listing->status = 'active';
        $listing->save();

        // Fetch
        $response = $this->getJson('/api/listings?category_id='.$category->id);

        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data');
        $response->assertJsonFragment(['title' => 'Cat Excavator']);
    }

    public function test_hidden_listing_visibility_depends_on_actor_role()
    {
        $category = Category::create([
            'name' => 'Machines',
            'slug' => 'machines',
            'type' => 'machinery',
        ]);
        $city = City::create(['name' => 'Rabat', 'slug' => 'rabat']);

        $owner = User::factory()->create();
        $otherUser = User::factory()->create();
        $admin = User::factory()->create(['role' => 'admin']);

        $listing = Listing::create([
            'user_id' => $owner->id,
            'category_id' => $category->id,
            'city_id' => $city->id,
            'title' => 'Hidden Listing',
            'slug' => 'hidden-listing',
            'description' => 'Internal listing',
            'price' => 1200,
            'status' => 'hidden',
            'price_unit' => 'DH/day',
        ]);

        $this->getJson('/api/listings/'.$listing->id)->assertStatus(404);
        Sanctum::actingAs($otherUser);
        $this->getJson('/api/listings/'.$listing->id)->assertStatus(403);
        Sanctum::actingAs($owner);
        $this->getJson('/api/listings/'.$listing->id)->assertStatus(200);
        Sanctum::actingAs($admin);
        $this->getJson('/api/listings/'.$listing->id)->assertStatus(200);
    }

    public function test_owner_can_list_own_pending_listings_via_user_filter()
    {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();
        $category = Category::create([
            'name' => 'Cars',
            'slug' => 'cars',
            'type' => 'car_rental',
        ]);

        Listing::create([
            'user_id' => $owner->id,
            'category_id' => $category->id,
            'title' => 'Pending Owner Listing',
            'slug' => 'pending-owner-listing',
            'price' => 300,
            'status' => 'pending',
            'price_unit' => 'DH/day',
        ]);

        Sanctum::actingAs($owner);
        $response = $this->getJson('/api/listings?user_id='.$owner->id);
        $response->assertOk()->assertJsonCount(1, 'data');

        Sanctum::actingAs($otherUser);
        $responseOther = $this->getJson('/api/listings?user_id='.$owner->id);
        $responseOther->assertOk()->assertJsonCount(0, 'data');
    }
}
