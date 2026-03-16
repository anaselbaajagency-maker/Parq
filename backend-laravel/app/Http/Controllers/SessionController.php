<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SessionController extends Controller
{
    /**
     * List all active sessions for the user.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $sessions = $user->tokens()->orderBy('last_used_at', 'desc')->get()->map(function ($token) use ($request) {
            return [
                'id' => $token->id,
                'device_name' => $token->name,
                'ip_address' => $token->ip_address,
                'user_agent' => $token->user_agent,
                'last_used_at' => $token->last_used_at,
                'created_at' => $token->created_at,
                'is_current' => $token->id === $request->user()->currentAccessToken()->id,
            ];
        });

        return response()->json([
            'sessions' => $sessions
        ]);
    }

    /**
     * Revoke a specific session.
     */
    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        $token = $user->tokens()->find($id);

        if (!$token) {
            return response()->json(['message' => 'Session not found'], 404);
        }

        $token->delete();

        return response()->json([
            'message' => 'Session revoked successfully'
        ]);
    }

    /**
     * Revoke all other sessions.
     */
    public function revokeOthers(Request $request)
    {
        $user = $request->user();
        $currentTokenId = $user->currentAccessToken()->id;

        $user->tokens()->where('id', '!=', $currentTokenId)->delete();

        return response()->json([
            'message' => 'All other sessions revoked successfully'
        ]);
    }
}
