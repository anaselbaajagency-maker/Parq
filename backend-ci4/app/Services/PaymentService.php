<?php

namespace App\Services;

use App\Models\PaymentMethodModel;

class PaymentService
{
    protected $pmModel;

    public function __construct()
    {
        $this->pmModel = new \App\Models\PaymentMethodModel();
    }

    public function getAvailableMethods()
    {
        return $this->pmModel->where('is_active', true)
                             ->orderBy('order', 'asc')
                             ->findAll();
    }

    public function validateCallback(string $method, array $params)
    {
        // Gateway-specific validation (Stripe, CMI, etc.)
        return true; 
    }
}
