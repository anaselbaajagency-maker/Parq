<?php

namespace App\Http\Controllers;

use App\Models\Listing;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * Get user profile with public information and active listings
     */
    public function getProfile($id)
    {
        $user = User::select('id', 'full_name', 'avatar', 'created_at', 'role', 'phone', 'bio', 'city_id')
            ->findOrFail($id);

        // Fetch active listings for this user
        $listings = Listing::where('user_id', $id)
            ->where('status', 'active')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'user' => $user,
            'listings' => $listings,
        ]);
    }

    /**
     * Update authenticated user profile
     */
    public function updateProfile(Request $request)
    {
        $user = Auth::guard('sanctum')->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $validator = Validator::make($request->all(), [
            'full_name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|nullable|string|max:20',
            'city_id' => 'sometimes|nullable|exists:cities,id',
            'bio' => 'sometimes|nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user->update($request->only(['full_name', 'phone', 'city_id', 'bio']));

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }

    /**
     * Update authenticated user avatar
     */
    public function updateAvatar(Request $request)
    {
        $user = Auth::guard('sanctum')->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $validator = Validator::make($request->all(), [
            'avatar' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if ($request->hasFile('avatar')) {
            // Delete old avatar if exists and is local
            if ($user->avatar && str_contains($user->avatar, 'storage/avatars')) {
                $oldPath = str_replace(asset('storage/'), '', $user->avatar);
                \Illuminate\Support\Facades\Storage::disk('public')->delete($oldPath);
            }

            $path = $request->file('avatar')->store('avatars', 'public');
            $url = asset('storage/' . $path);
            
            $user->update(['avatar' => $url]);

            return response()->json([
                'message' => 'Avatar updated successfully',
                'avatar' => $url,
                'user' => $user
            ]);
        }

        return response()->json(['message' => 'No avatar file provided'], 400);
    }
}
