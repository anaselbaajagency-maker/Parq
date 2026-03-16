<?php

namespace App\Services;

use App\Models\Setting;
use Illuminate\Support\Facades\Cache;

class RuntimeSettingService
{
    private const CACHE_KEY = 'runtime_settings';

    public function all(): array
    {
        $ttlSeconds = max((int) config('security.settings_cache_ttl_seconds', 30), 1);

        return Cache::remember(self::CACHE_KEY, now()->addSeconds($ttlSeconds), function (): array {
            return Setting::query()->pluck('value', 'key')->toArray();
        });
    }

    public function get(string $key, mixed $default = null): mixed
    {
        return $this->all()[$key] ?? $default;
    }

    public function maintenanceModeEnabled(): bool
    {
        return $this->toBoolean($this->get('maintenance_mode', false));
    }

    public function maintenanceMessage(): string
    {
        return (string) $this->get('maintenance_message', 'Service temporarily unavailable for maintenance.');
    }

    public function forgetCache(): void
    {
        Cache::forget(self::CACHE_KEY);
    }

    private function toBoolean(mixed $value): bool
    {
        if (is_bool($value)) {
            return $value;
        }

        if (is_numeric($value)) {
            return (int) $value === 1;
        }

        if (is_string($value)) {
            return in_array(strtolower(trim($value)), ['1', 'true', 'on', 'yes'], true);
        }

        return false;
    }
}
