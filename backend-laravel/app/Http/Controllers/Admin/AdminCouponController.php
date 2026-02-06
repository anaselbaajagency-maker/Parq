<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class AdminCouponController extends Controller
{
    /**
     * Get all coupons.
     * 
     * GET /api/admin/coupons
     */
    public function index(Request $request): JsonResponse
    {
        $query = Coupon::query();

        if ($request->has('active_only')) {
            $query->active();
        }

        if ($request->has('valid_only')) {
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
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'code' => 'required|string|min:3|max:20|unique:coupons,code',
            'credit_amount' => 'required|integer|min:1|max:10000',
            'max_uses' => 'integer|min:1',
            'expires_at' => 'nullable|date|after:now',
            'description' => 'nullable|string|max:255',
        ]);

        $coupon = Coupon::create([
            'code' => strtoupper($request->input('code')),
            'credit_amount' => $request->input('credit_amount'),
            'max_uses' => $request->input('max_uses', 1),
            'expires_at' => $request->input('expires_at'),
            'description' => $request->input('description'),
            'is_active' => true,
        ]);

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
    public function update(Request $request, int $id): JsonResponse
    {
        $coupon = Coupon::findOrFail($id);

        $request->validate([
            'code' => ['string', 'min:3', 'max:20', Rule::unique('coupons')->ignore($coupon->id)],
            'credit_amount' => 'integer|min:1|max:10000',
            'max_uses' => 'integer|min:1',
            'expires_at' => 'nullable|date',
            'description' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ]);

        $coupon->update($request->only([
            'code',
            'credit_amount',
            'max_uses',
            'expires_at',
            'description',
            'is_active',
        ]));

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

        return response()->json([
            'success' => true,
            'message' => 'Coupon supprimé',
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
        $coupon->update(['is_active' => !$coupon->is_active]);

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
