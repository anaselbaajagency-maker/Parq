<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class MessageController extends Controller
{
    /**
     * Get list of conversations for the authenticated user.
     * Returns a list of users the current user has exchanged messages with,
     * along with the last message.
     */
    public function index(Request $request)
    {
        $userId = Auth::id();

        // Get latest message for each conversation
        // We group by the 'other' user ID
        $conversations = Message::where('sender_id', $userId)
            ->orWhere('receiver_id', $userId)
            ->with(['sender', 'receiver'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->groupBy(function($message) use ($userId) {
                return $message->sender_id == $userId ? $message->receiver_id : $message->sender_id;
            })
            ->map(function($messages) use ($userId) {
                $lastMessage = $messages->first(); // Since we ordered by desc
                $otherUser = $lastMessage->sender_id == $userId ? $lastMessage->receiver : $lastMessage->sender;
                $unreadCount = $messages->where('receiver_id', $userId)->whereNull('read_at')->count();

                return [
                    'user' => $otherUser,
                    'last_message' => $lastMessage,
                    'unread_count' => $unreadCount
                ];
            })
            ->values();

        return response()->json($conversations);
    }

    /**
     * Get messages between authenticated user and specific user.
     */
    public function show($otherUserId)
    {
        $userId = Auth::id();
        
        // Mark messages as read
        Message::where('sender_id', $otherUserId)
            ->where('receiver_id', $userId)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        $messages = Message::where(function($q) use ($userId, $otherUserId) {
                $q->where('sender_id', $userId)->where('receiver_id', $otherUserId);
            })
            ->orWhere(function($q) use ($userId, $otherUserId) {
                $q->where('sender_id', $otherUserId)->where('receiver_id', $userId);
            })
            ->orderBy('created_at', 'asc') // Chat order
            ->get();

        return response()->json($messages);
    }

    /**
     * Send a new message.
     */
    public function store(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'content' => 'required|string',
            'listing_id' => 'nullable|exists:listings,id'
        ]);

        $message = Message::create([
            'sender_id' => Auth::id(),
            'receiver_id' => $request->receiver_id,
            'listing_id' => $request->listing_id,
            'content' => $request->content,
        ]);

        return response()->json($message, 201);
    }

    /**
     * Get total unread count for badge.
     */
    public function unreadCount()
    {
        $count = Message::where('receiver_id', Auth::id())
            ->whereNull('read_at')
            ->count();
        
        return response()->json(['count' => $count]);
    }
}
