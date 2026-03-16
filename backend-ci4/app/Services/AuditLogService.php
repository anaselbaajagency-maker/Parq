<?php

namespace App\Services;

class AuditLogService
{
    public function log(int $userId, string $action, string $model, int $modelId, array $payload = [])
    {
        // Simple log implementation
        log_message('info', "Audit: User {$userId} performed {$action} on {$model}:{$modelId}");
    }
}
