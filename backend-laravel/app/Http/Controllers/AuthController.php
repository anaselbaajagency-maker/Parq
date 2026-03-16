<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\GoogleLoginRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    protected function issueToken(User $user, Request $request): string
    {
        $clientType = strtolower((string) $request->input('client_type', 'mobile'));
        $deviceName = (string) $request->input('device_name', $clientType === 'web' ? 'web-spa' : 'mobile-app');
        $abilities = $clientType === 'web' ? ['web'] : ['mobile'];
        $expirationMinutes = (int) (config('sanctum.expiration') ?? 0);
        $expiresAt = $expirationMinutes > 0 ? now()->addMinutes($expirationMinutes) : null;

        $tokenResult = $user->createToken($deviceName, $abilities, $expiresAt);

        // Update the token metadata
        $tokenResult->accessToken->forceFill([
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ])->save();

        return $tokenResult->plainTextToken;
    }

    public function register(RegisterRequest $request)
    {
        $validated = $request->validated();

        $user = User::create([
            'full_name' => $validated['full_name'],
            'email' => $validated['email'],
            'password' => ! empty($validated['password']) ? Hash::make((string) $validated['password']) : null,
            'role' => strtolower((string) $validated['role']) === 'client' ? 'user' : strtolower((string) $validated['role']),
            'phone' => $validated['phone'] ?? null,
            'google_id' => $validated['google_id'] ?? null,
            'avatar' => $validated['avatar'] ?? null,
        ]);

        // Mark email as verified if Google Sign Up
        if (! empty($validated['google_id'])) {
            $user->email_verified_at = now();
            $user->save();
        }

        $token = $this->issueToken($user, $request);

        return response()->json([
            'success' => true,
            'message' => 'Registration successful',
            'user' => (new UserResource($user))->resolve(),
            'token' => $token,
        ], 201);
    }

    public function login(LoginRequest $request)
    {
        $validated = $request->validated();

        $user = User::where('email', $validated['email'])->first();

        if (! $user || ! Hash::check((string) $validated['password'], (string) $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Identifiants incorrects.'],
            ]);
        }

        // Keep existing tokens or clear? Let's clear for cleaner state.
        $user->tokens()->delete();

        $token = $this->issueToken($user, $request);

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'user' => (new UserResource($user))->resolve(),
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        if ($request->user()) {
            $request->user()->currentAccessToken()->delete();
        }

        return response()->json([
            'success' => true,
            'message' => 'Logged out',
        ]);
    }

    public function googleLogin(GoogleLoginRequest $request)
    {
        $validated = $request->validated();

        $user = User::where('email', $validated['email'])->first();

        if ($user) {
            // Update google_id if missing
            if (! $user->google_id) {
                $user->google_id = $validated['google_id'];
                $user->save();
            }
        } else {
            // Create new user
            $user = User::create([
                'full_name' => $validated['full_name'],
                'email' => $validated['email'],
                'google_id' => $validated['google_id'],
                'avatar' => $validated['avatar'] ?? null,
                'password' => null,
                'role' => 'user',
                'email_verified_at' => now(),
            ]);
        }

        $user->tokens()->delete();
        $token = $this->issueToken($user, $request);

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'user' => (new UserResource($user))->resolve(),
            'token' => $token,
        ]);
    }

    public function forgotPassword(ForgotPasswordRequest $request)
    {
        $validated = $request->validated();

        // We will send the password reset link if the user exists
        // This relies on default Laravel Password Broker
        $status = \Illuminate\Support\Facades\Password::sendResetLink(
            ['email' => $validated['email']]
        );

        // Always return success to prevent email enumeration,
        // or return actual status if preferred for UX (but less secure)
        // User requested: "Si un compte existe... vous recevrez..."

        if ($status === \Illuminate\Support\Facades\Password::RESET_LINK_SENT) {
            return response()->json(['success' => true, 'message' => __($status)]);
        }

        // Even if failed (e.g. user not found), return success message for security?
        // Or specific error? The user prompt implies success message is what they want.
        // "Si un compte existe pour X, vous recevrez..."
        return response()->json([
            'success' => true,
            'message' => 'Si un compte existe pour cet email, vous recevrez les instructions sous peu.',
        ]);
    }
}
