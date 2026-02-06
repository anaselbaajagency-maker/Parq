<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AdminUserController extends Controller
{
    /**
     * Get paginated list of users.
     * 
     * GET /api/admin/users
     */
    public function index(Request $request): JsonResponse
    {
        $query = User::query();

        // Search by name or email
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filter by role
        if ($request->has('role') && $request->role !== 'all') {
            $query->where('role', $request->role);
        }

        // Filter by status (active/inactive) - Assuming we might have this later, 
        // currently relying on email_verified_at or just basic listing
        if ($request->has('status')) {
            if ($request->status === 'verified') {
                $query->whereNotNull('email_verified_at');
            } elseif ($request->status === 'unverified') {
                $query->whereNull('email_verified_at');
            }
        }

        $users = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json($users);
    }

    /**
     * Get single user details.
     * 
     * GET /api/admin/users/{id}
     */
    public function show(int $id): JsonResponse
    {
        $user = User::withCount('listings')->findOrFail($id);
        
        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

    /**
     * Update user role or details.
     * 
     * PUT /api/admin/users/{id}
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);
        
        $validated = $request->validate([
            'role' => 'sometimes|in:user,admin,provider',
            'full_name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
        ]);

        $user->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Utilisateur mis à jour avec succès',
            'data' => $user
        ]);
    }

    /**
     * Delete user.
     * 
     * DELETE /api/admin/users/{id}
     */
    public function destroy(int $id): JsonResponse
    {
        $user = User::findOrFail($id);
        
        // Prevent deleting self
        if (auth()->id() === $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Vous ne pouvez pas supprimer votre propre compte.'
            ], 403);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Utilisateur supprimé avec succès'
        ]);
    }
}
