<?php

namespace Tests\Feature;

use App\Models\TopUpRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class WalletApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_topup_validation_rejects_too_small_amount(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $this
            ->postJson('/api/wallet/topup', [
                'amount' => 1,
                'method' => 'cmi',
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['amount']);
    }

    public function test_redeem_coupon_returns_structured_error_for_invalid_code(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $this
            ->postJson('/api/wallet/redeem-coupon', [
                'code' => 'INVALID-CODE',
            ])
            ->assertStatus(422)
            ->assertJsonPath('success', false)
            ->assertJsonPath('error', 'invalid_coupon');
    }

    public function test_user_cannot_cancel_another_users_topup_request(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();

        $request = TopUpRequest::create([
            'user_id' => $owner->id,
            'amount' => 100,
            'method' => TopUpRequest::METHOD_BANK_TRANSFER,
            'status' => TopUpRequest::STATUS_PENDING,
            'payment_reference' => 'TEST-REF-123456',
        ]);

        Sanctum::actingAs($other);

        $this
            ->deleteJson('/api/wallet/topup-requests/'.$request->id)
            ->assertStatus(404);
    }
}
