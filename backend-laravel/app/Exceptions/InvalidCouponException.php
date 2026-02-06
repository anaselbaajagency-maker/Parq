<?php

namespace App\Exceptions;

use Exception;

class InvalidCouponException extends Exception
{
    protected $code = 422; // Unprocessable Entity

    public function __construct(string $message = 'Code coupon invalide')
    {
        parent::__construct($message, $this->code);
    }

    /**
     * Render the exception as an HTTP response.
     */
    public function render($request)
    {
        return response()->json([
            'success' => false,
            'error' => 'invalid_coupon',
            'message' => $this->getMessage(),
        ], $this->code);
    }
}
