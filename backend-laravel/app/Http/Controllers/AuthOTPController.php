<?php

namespace App\Http\Controllers;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AuthOTPController extends Controller
{
    /**
     * Send OTP to the given phone number.
     *
     * POST /api/auth/otp/send
     */
    public function sendOTP(Request $request)
    {
        $request->validate([
            'phone' => 'required|string|min:10',
        ]);

        $phone = $request->phone;
        // Generate a 6-digit code
        $code = (string) rand(100000, 999999);
        $expiresAt = Carbon::now()->addMinutes(10);

        // Store OTP
        DB::table('otps')->insert([
            'phone' => $phone,
            'code' => $code, // In production, hash this for security
            'expires_at' => $expiresAt,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        // Mock sending OTP
        Log::info("OTP for {$phone}: {$code}");

        return response()->json([
            'success' => true,
            'message' => 'OTP sent successfully (check logs)',
            'expires_at' => $expiresAt->toIso8601String(),
        ]);
    }

    /**
     * Verify OTP and login/register user.
     *
     * POST /api/auth/otp/verify
     */
    public function verifyOTP(Request $request)
    {
        $request->validate([
            'phone' => 'required|string',
            'code' => 'required|string|size:6',
        ]);

        $otp = DB::table('otps')
            ->where('phone', $request->phone)
            ->where('code', $request->code)
            ->where('expires_at', '>', Carbon::now())
            ->whereNull('verified_at')
            ->orderBy('created_at', 'desc')
            ->first();

        if (! $otp) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired OTP',
            ], 422);
        }

        // Mark as verified
        DB::table('otps')->where('id', $otp->id)->update(['verified_at' => Carbon::now()]);

        // Find or create user
        $user = User::where('phone', $request->phone)->first();

        if (! $user) {
            // Create user with a dummy email if needed (Laravel users usually need email)
            // Or use phone as the unique identifier if the system supports it.
            // For now, let's create a placeholder email to satisfy constraints.
            $user = User::create([
                'full_name' => 'User '.substr($request->phone, -4),
                'email' => $request->phone.'@parq.ma',
                'phone' => $request->phone,
                'role' => 'user',
                'password' => null, // No password for OTP users
            ]);
        }

        // Create token
        $token = $user->createToken('parq-mobile-auth')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Authentication successful',
            'user' => $user,
            'token' => $token,
        ]);
    }
}
