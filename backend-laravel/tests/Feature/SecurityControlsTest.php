<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SecurityControlsTest extends TestCase
{
    use RefreshDatabase;

    public function test_non_admin_cannot_access_admin_stats(): void
    {
        $user = User::factory()->create(['role' => 'user']);

        Sanctum::actingAs($user);

        $this
            ->getJson('/api/admin/stats')
            ->assertStatus(403);
    }

    public function test_admin_can_access_admin_stats(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        Sanctum::actingAs($admin);

        $this
            ->getJson('/api/admin/stats')
            ->assertOk()
            ->assertJsonStructure([
                'total_users',
                'total_listings',
                'pending_approvals',
                'total_revenue',
            ]);
    }

    public function test_api_responses_include_security_headers(): void
    {
        $response = $this->getJson('/api/listings');

        $response->assertOk()
            ->assertHeader('X-Content-Type-Options', 'nosniff')
            ->assertHeader('X-Frame-Options', 'SAMEORIGIN')
            ->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
            ->assertHeader('Permissions-Policy');
    }
}
