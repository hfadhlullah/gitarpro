<?php

namespace App\Console\Commands;

use Illuminate\Foundation\Console\ServeCommand as BaseServeCommand;

/**
 * Extends the base ServeCommand to inject `-d extension=intl` into the
 * spawned `php -S` child process. This is necessary because the intl
 * extension is not enabled in the system php.ini, and the child process
 * does not inherit ini overrides from the parent artisan process.
 */
class ServeCommand extends BaseServeCommand
{
    protected function serverCommand(): array
    {
        $command = parent::serverCommand();

        // Inject -d extension=intl after the PHP binary (index 0)
        array_splice($command, 1, 0, ['-d', 'extension=intl']);

        return $command;
    }
}
