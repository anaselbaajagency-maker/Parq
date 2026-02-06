<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Listing;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Get user profile with public information and active listings
     */
    public function getProfile($id)
    {
        $user = User::select('id', 'full_name', 'avatar', 'created_at', 'role', 'phone')
            ->findOrFail($id);

        // Fetch active listings for this user
        $listings = Listing::where('user_id', $id)
            ->where('status', 'active') 
            // We might want to check is_available too, depending on requirements, 
            // but 'status' => 'active' is the main published check.
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'user' => $user,
            'listings' => $listings
        ]);
    }
}
