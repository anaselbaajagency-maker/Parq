<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserDataLifecycleService
{
    public function __construct(private AuditLogService $auditLogService) {}

    public function anonymizeAndDelete(User $user, ?User $actor = null, string $reason = 'user_request'): void
    {
        DB::transaction(function () use ($user) {
            $user->refresh();

            // Hide and soft-delete listings so they disappear from the marketplace.
            $user->listings()->update([
                'status' => 'hidden',
                'is_available' => false,
            ]);
            $user->listings()->delete();

            // Revoke active tokens/sessions.
            $user->tokens()->delete();
            DB::table('sessions')->where('user_id', $user->id)->delete();

            $anonymizedEmail = sprintf(
                'deleted+%d+%s@anonymized.local',
                $user->id,
                now()->format('YmdHis')
            );

            $user->forceFill([
                'full_name' => 'Deleted User #'.$user->id,
                'email' => $anonymizedEmail,
                'phone' => null,
                'avatar' => null,
                'google_id' => null,
                'password' => Hash::make(Str::random(64)),
                'anonymized_at' => now(),
            ])->save();

            if (! $user->trashed()) {
                $user->delete();
            }
        });

        $this->auditLogService->log(
            action: 'user.data.anonymized_deleted',
            actor: $actor ?? $user,
            targetType: User::class,
            targetId: $user->id,
            context: [
                'reason' => $reason,
            ]
        );
    }
}
