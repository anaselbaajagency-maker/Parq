<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class AuthOtpTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_send_an_otp()
    {
        $response = $this->postJson('/api/auth/otp/send', [
            'phone' => '0612345678',
        ]);

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $this->assertDatabaseHas('otps', [
            'phone' => '0612345678',
        ]);
    }

    /** @test */
    public function it_can_verify_an_otp_and_login()
    {
        // 1. Send OTP
        $this->postJson('/api/auth/otp/send', ['phone' => '0612345678']);
        $otp = DB::table('otps')->first();

        // 2. Verify OTP
        $response = $this->postJson('/api/auth/otp/verify', [
            'phone' => '0612345678',
            'code' => $otp->code,
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'user' => ['id', 'phone', 'full_name'],
                'token',
            ]);

        $this->assertDatabaseHas('users', ['phone' => '0612345678']);
    }

    /** @test */
    public function it_fails_with_invalid_otp()
    {
        $this->postJson('/api/auth/otp/send', ['phone' => '0612345678']);

        $response = $this->postJson('/api/auth/otp/verify', [
            'phone' => '0612345678',
            'code' => '000000', // Wrong code
        ]);

        $response->assertStatus(422)
            ->assertJson(['success' => false]);
    }
}
