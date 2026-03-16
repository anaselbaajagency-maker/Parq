<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\HandlesCacheableJsonResponses;
use App\Http\Requests\Setting\SettingBulkUpdateRequest;
use App\Models\Setting;
use App\Services\RuntimeSettingService;
use Illuminate\Support\Facades\Cache;

class SettingController extends Controller
{
    use HandlesCacheableJsonResponses;

    public function __construct(private RuntimeSettingService $runtimeSettingService) {}

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Direct DB query to bypass potential cache issues causing 500
        return response()->json(Setting::query()->pluck('value', 'key')->toArray());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store()
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function bulkUpdate(SettingBulkUpdateRequest $request)
    {
        $data = $request->validated();

        foreach ($data as $key => $value) {
            $normalizedValue = match (true) {
                is_bool($value) => $value ? '1' : '0',
                $value === null => null,
                is_scalar($value) => (string) $value,
                default => json_encode($value, JSON_UNESCAPED_UNICODE),
            };

            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $normalizedValue]
            );
        }

        $this->runtimeSettingService->forgetCache();
        $this->bumpSettingsCacheVersion();

        return response()->json([
            'message' => 'Settings updated successfully',
            'settings' => Setting::query()->pluck('value', 'key')->toArray(),
        ])->withHeaders([
            'Cache-Control' => 'no-store',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    private function settingsCacheVersion(): int
    {
        return (int) Cache::get('settings_cache_version', 1);
    }

    private function bumpSettingsCacheVersion(): void
    {
        Cache::forever('settings_cache_version', $this->settingsCacheVersion() + 1);
    }
}
