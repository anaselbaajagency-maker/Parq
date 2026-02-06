<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Category;
use App\Models\City;

class ListingsApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_listing_with_car_params()
    {
        // 1. Setup Data
        $user = User::factory()->create();
        $category = Category::create([
            'name' => 'Voitures',
            'slug' => 'voitures',
            'type' => 'car_rental',
            'daily_cost' => 10
        ]);
        $city = City::create(['name' => 'Casablanca', 'slug' => 'casablanca']);

        // 2. Action: Post Listing
        $response = $this->actingAs($user)->postJson('/api/listings', [
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
            'gearbox' => 'Automatic'
        ]);
        
        $listingId = $response->json('id');
        $this->assertNotNull($listingId);
    }

    public function test_can_fetch_listings_with_filters()
    {
         $user = User::factory()->create();
         $category = Category::create([
             'name' => 'Machinery',
             'slug' => 'machinery',
             'type' => 'machinery',
             'daily_cost' => 20
         ]);
         
         // Create active listing
         $this->actingAs($user)->postJson('/api/listings', [
            'category_id' => $category->id,
            'title' => 'Cat Excavator',
            'price' => 2000,
            'brand' => 'Caterpillar',
            'model' => '320'
         ])->assertStatus(201);
         
         // Manually activate it since default is pending
         $listing = \App\Models\Listing::first();
         $listing->status = 'active';
         $listing->save();

         // Fetch
         $response = $this->getJson('/api/listings?category_id=' . $category->id);
         
         $response->assertStatus(200);
         $response->assertJsonCount(1, 'data');
         $response->assertJsonFragment(['title' => 'Cat Excavator']);
    }
}
