<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminCouponIndexRequest;
use App\Http\Requests\Admin\AdminCouponStoreRequest;
use App\Http\Requests\Admin\AdminCouponUpdateRequest;
use App\Models\Coupon;
use App\Services\AuditLogService;
use Illuminate\Http\JsonResponse;

class AdminCouponController extends Controller
{
    public function __construct(
        protected AuditLogService $auditLogService
    ) {}

    /**
     * Get all coupons.
     *
     * GET /api/admin/coupons
     */
    public function index(AdminCouponIndexRequest $request): JsonResponse
    {
        $query = Coupon::query();

        if ($request->boolean('active_only')) {
            $query->active();
        }

        if ($request->boolean('valid_only')) {
            $query->valid();
        }

        $coupons = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $coupons->map(function ($coupon) {
                return $this->formatCoupon($coupon);
            }),
        ]);
    }

    /**
     * Create a new coupon.
     *
     * POST /api/admin/coupons
     */
    public function store(AdminCouponStoreRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $coupon = Coupon::create([
            'code' => strtoupper((string) $validated['code']),
            'credit_amount' => $validated['credit_amount'],
            'max_uses' => $validated['max_uses'] ?? 1,
            'expires_at' => $validated['expires_at'] ?? null,
            'description' => $validated['description'] ?? null,
            'is_active' => true,
        ]);

        $this->auditLogService->log(
            'admin.coupon.created',
            $request->user(),
            'coupon',
            $coupon->id,
            [
                'code' => $coupon->code,
                'credit_amount' => $coupon->credit_amount,
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Coupon créé avec succès',
            'data' => $this->formatCoupon($coupon),
        ], 201);
    }

    /**
     * Get a single coupon.
     *
     * GET /api/admin/coupons/{id}
     */
    public function show(int $id): JsonResponse
    {
        $coupon = Coupon::with('users:id,full_name,email')->findOrFail($id);

        $data = $this->formatCoupon($coupon);
        $data['used_by'] = $coupon->users->map(function ($user) {
            return [
                'id' => $user->id,
                'full_name' => $user->full_name,
                'email' => $user->email,
                'used_at' => $user->pivot->used_at,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    /**
     * Update a coupon.
     *
     * PUT /api/admin/coupons/{id}
     */
    public function update(AdminCouponUpdateRequest $request, int $id): JsonResponse
    {
        $coupon = Coupon::findOrFail($id);
        $coupon->update($request->validated());

        $this->auditLogService->log(
            'admin.coupon.updated',
            $request->user(),
            'coupon',
            $coupon->id
        );

        return response()->json([
            'success' => true,
            'message' => 'Coupon mis à jour',
            'data' => $this->formatCoupon($coupon->fresh()),
        ]);
    }

    /**
     * Delete a coupon.
     *
     * DELETE /api/admin/coupons/{id}
     */
    public function destroy(int $id): JsonResponse
    {
        $coupon = Coupon::findOrFail($id);

        // Don't delete if it's been used
        if ($coupon->used_count > 0) {
            return response()->json([
                'success' => false,
                'error' => 'coupon_used',
                'message' => 'Ce coupon a déjà été utilisé et ne peut pas être supprimé. Désactivez-le plutôt.',
            ], 422);
        }

        $coupon->delete();

        $this->auditLogService->log(
            'admin.coupon.deleted',
            request()->user(),
            'coupon',
            $id
        );

        return response()->json([
            'success' => true,
            'message' => 'Coupon supprimé',
        ]);
    }

    /**
     * Bulk delete coupons.
     *
     * POST /api/admin/coupons/bulk-delete
     */
    public function bulkDestroy(\Illuminate\Http\Request $request): JsonResponse
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:coupons,id',
        ]);

        $ids = $request->input('ids');
        $coupons = Coupon::whereIn('id', $ids)->get();

        $deletedCount = 0;
        foreach ($coupons as $coupon) {
            // Only delete if it's NOT been used
            if ($coupon->used_count === 0) {
                $coupon->delete();
                $deletedCount++;

                $this->auditLogService->log(
                    'admin.coupon.deleted',
                    $request->user(),
                    'coupon',
                    $coupon->id
                );
            }
        }

        return response()->json([
            'success' => true,
            'message' => "{$deletedCount} coupons supprimés avec succès.",
            'deleted_count' => $deletedCount,
        ]);
    }

    /**
     * Toggle coupon active status.
     *
     * POST /api/admin/coupons/{id}/toggle
     */
    public function toggle(int $id): JsonResponse
    {
        $coupon = Coupon::findOrFail($id);
        $coupon->update(['is_active' => ! $coupon->is_active]);

        $this->auditLogService->log(
            'admin.coupon.toggled',
            request()->user(),
            'coupon',
            $coupon->id,
            [
                'is_active' => $coupon->is_active,
            ]
        );

        return response()->json([
            'success' => true,
            'message' => $coupon->is_active ? 'Coupon activé' : 'Coupon désactivé',
            'data' => [
                'is_active' => $coupon->is_active,
            ],
        ]);
    }

    /**
     * Format coupon for JSON response.
     */
    protected function formatCoupon(Coupon $coupon): array
    {
        return [
            'id' => $coupon->id,
            'code' => $coupon->code,
            'credit_amount' => $coupon->credit_amount,
            'max_uses' => $coupon->max_uses,
            'used_count' => $coupon->used_count,
            'remaining_uses' => $coupon->remaining_uses,
            'expires_at' => $coupon->expires_at?->toIso8601String(),
            'is_active' => $coupon->is_active,
            'is_valid' => $coupon->isValid(),
            'is_expired' => $coupon->isExpired(),
            'description' => $coupon->description,
            'created_at' => $coupon->created_at->toIso8601String(),
        ];
    }
}
