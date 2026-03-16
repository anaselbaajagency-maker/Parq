<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminPaymentMethodStoreRequest;
use App\Http\Requests\Admin\AdminPaymentMethodUpdateRequest;
use App\Models\PaymentMethod;
use Illuminate\Http\JsonResponse;

class AdminPaymentMethodController extends Controller
{
    /**
     * Get all payment methods (including config).
     */
    public function index(): JsonResponse
    {
        $methods = PaymentMethod::ordered()->get()->makeVisible('config');

        return response()->json([
            'success' => true,
            'data' => $methods,
        ]);
    }

    /**
     * Update a payment method.
     */
    public function update(AdminPaymentMethodUpdateRequest $request, int $id): JsonResponse
    {
        $method = PaymentMethod::findOrFail($id);

        $validated = $request->validated();

        $method->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Méthode de paiement mise à jour',
            'data' => $method->makeVisible('config'),
        ]);
    }

    /**
     * Toggle active status.
     */
    public function toggle(int $id): JsonResponse
    {
        $method = PaymentMethod::findOrFail($id);
        $method->is_active = ! $method->is_active;
        $method->save();

        return response()->json([
            'success' => true,
            'message' => 'Statut mis à jour',
            'is_active' => $method->is_active,
        ]);
    }

    /**
     * Create a new payment method.
     */
    public function store(AdminPaymentMethodStoreRequest $request): JsonResponse
    {
        $method = PaymentMethod::create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Méthode de paiement créée',
            'data' => $method->makeVisible('config'),
        ], 201);
    }

    /**
     * Delete a payment method.
     */
    public function destroy(int $id): JsonResponse
    {
        $method = PaymentMethod::findOrFail($id);
        $method->delete();

        return response()->json([
            'success' => true,
            'message' => 'Méthode de paiement supprimée',
        ]);
    }

    /**
     * Bulk delete payment methods.
     */
    public function bulkDestroy(\Illuminate\Http\Request $request): JsonResponse
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:payment_methods,id',
        ]);

        $ids = $request->input('ids');
        PaymentMethod::whereIn('id', $ids)->delete();

        return response()->json([
            'success' => true,
            'message' => count($ids) . ' méthodes de paiement supprimées.',
        ]);
    }
}
