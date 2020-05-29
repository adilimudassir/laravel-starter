<?php

namespace App\Providers;

use RecursiveIteratorIterator;
use RecursiveDirectoryIterator;
use Illuminate\Support\ServiceProvider;

class HelperServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        $directoryIterator = new RecursiveDirectoryIterator(app_path('Helpers'));
        $iterator = new RecursiveIteratorIterator($directoryIterator);

        while ($iterator->valid()) {
            if (
                !$iterator->isDot() &&
                $iterator->isFile() && 
                $iterator->isReadable() && 
                $iterator->current()->getExtension() === 'php'
            ) {
                require $iterator->key();
            }

            $iterator->next();
        }
    }
}
