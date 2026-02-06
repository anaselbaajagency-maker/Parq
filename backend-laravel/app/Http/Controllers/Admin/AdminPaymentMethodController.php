<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PaymentMethod;
use Illuminate\Http\Request;
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
    public function update(Request $request, int $id): JsonResponse
    {
        $method = PaymentMethod::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_ar' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
            'config' => 'nullable|array',
            'icon' => 'nullable|string|max:50'
        ]);

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
        $method->is_active = !$method->is_active;
        $method->save();

        return response()->json([
            'success' => true,
            'message' => 'Statut mis à jour',
            'is_active' => $method->is_active
        ]);
    }
}
