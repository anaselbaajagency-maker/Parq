<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'nullable|string|min:8|required_without:google_id',
            'role' => 'required|string|in:CLIENT,PROVIDER,client,provider',
            'google_id' => 'nullable|string',
            'avatar' => 'nullable|string',
        ]);

        $user = User::create([
            'full_name' => $request->full_name,
            'email' => $request->email,
            'password' => $request->password ? Hash::make($request->password) : null,
            'role' => strtolower($request->role) === 'client' ? 'user' : strtolower($request->role),
            'phone' => $request->phone ?? null,
            'google_id' => $request->google_id ?? null,
            'avatar' => $request->avatar ?? null,
        ]);

        // Mark email as verified if Google Sign Up
        if ($request->google_id) {
            $user->email_verified_at = now();
            $user->save();
        }

        $token = $user->createToken('parq-auth')->plainTextToken;

        $userData = $user->toArray();
        $userData['role'] = strtoupper($user->role);

        return response()->json([
            'success' => true,
            'message' => 'Registration successful',
            'user' => $userData,
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Identifiants incorrects.'],
            ]);
        }

        // Keep existing tokens or clear? Let's clear for cleaner state.
        $user->tokens()->delete();

        $token = $user->createToken('parq-auth')->plainTextToken;

        $userData = $user->toArray();
        $userData['role'] = strtoupper($user->role);

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'user' => $userData,
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

    public function googleLogin(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'google_id' => 'required|string',
            'full_name' => 'required|string',
            'avatar' => 'nullable|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if ($user) {
            // Update google_id if missing
            if (! $user->google_id) {
                $user->google_id = $request->google_id;
                $user->save();
            }
        } else {
            // Create new user
            $user = User::create([
                'full_name' => $request->full_name,
                'email' => $request->email,
                'google_id' => $request->google_id,
                'avatar' => $request->avatar,
                'password' => null,
                'role' => 'user',
                'email_verified_at' => now(),
            ]);
        }

        $user->tokens()->delete();
        $token = $user->createToken('parq-auth')->plainTextToken;

        $userData = $user->toArray();
        $userData['role'] = strtoupper($user->role);

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'user' => $userData,
            'token' => $token,
        ]);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        // We will send the password reset link if the user exists
        // This relies on default Laravel Password Broker
        $status = \Illuminate\Support\Facades\Password::sendResetLink(
            $request->only('email')
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
