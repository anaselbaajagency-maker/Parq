<?php

namespace App\Exceptions;

use Exception;

class InsufficientBalanceException extends Exception
{
    protected $code = 402; // Payment Required

    public function __construct(string $message = 'Solde insuffisant')
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
            'error' => 'insufficient_balance',
            'message' => $this->getMessage(),
        ], $this->code);
    }
}
