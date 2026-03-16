<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Log;

class AuditLogService
{
    public function log(
        string $action,
        ?User $actor = null,
        ?string $targetType = null,
        string|int|null $targetId = null,
        array $context = []
    ): void {
        $payload = [
            'action' => $action,
            'actor_id' => $actor?->id,
            'actor_role' => $actor?->role,
            'target_type' => $targetType,
            'target_id' => $targetId,
            'context' => $context,
            'at' => now()->toIso8601String(),
        ];

        Log::channel(config('audit.channel', 'audit'))->info('audit_event', $payload);
    }
}
