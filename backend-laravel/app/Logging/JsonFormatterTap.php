<?php

namespace App\Logging;

use Illuminate\Log\Logger as IlluminateLogger;
use Monolog\Formatter\JsonFormatter;
use Monolog\Logger as MonologLogger;

class JsonFormatterTap
{
    public function __invoke(IlluminateLogger|MonologLogger $logger): void
    {
        if (! (bool) config('logging.structured', false)) {
            return;
        }

        $monolog = $logger instanceof IlluminateLogger ? $logger->getLogger() : $logger;

        foreach ($monolog->getHandlers() as $handler) {
            if (method_exists($handler, 'setFormatter')) {
                $handler->setFormatter(new JsonFormatter);
            }
        }
    }
}
