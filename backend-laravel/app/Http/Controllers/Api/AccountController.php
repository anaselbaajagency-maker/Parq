<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\DeleteAccountRequest;
use App\Services\UserDataLifecycleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class AccountController extends Controller
{
    public function __construct(private UserDataLifecycleService $userDataLifecycleService) {}

    public function destroy(DeleteAccountRequest $request): JsonResponse
    {
        $user = $request->user();
        if (! $user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $payload = $request->validated();

        if (! empty($payload['confirm_email']) && strcasecmp($payload['confirm_email'], $user->email) !== 0) {
            throw ValidationException::withMessages([
                'confirm_email' => ['The confirmation email does not match your account email.'],
            ]);
        }

        $this->userDataLifecycleService->anonymizeAndDelete(
            user: $user,
            actor: $user,
            reason: (string) ($payload['reason'] ?? 'user_request')
        );

        return response()->json([
            'message' => 'Account anonymized and scheduled for removal.',
        ], 202);
    }
}
