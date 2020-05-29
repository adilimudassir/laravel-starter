<?php

if (! function_exists('includeFilesInFolder')) {
    /**
     * Loops through a folder and requires all PHP files
     * Searches sub-directories as well.
     *
     * @param $folder
     */
    function includeFilesInFolder($folder)
    {
        try {
            $directoryIterator = new RecursiveDirectoryIterator($folder);
            $iterator = new RecursiveIteratorIterator($directoryIterator);

            while ($iterator->valid()) {
                if (
                    ! $iterator->isDot() && 
                    $iterator->isFile() && 
                    $iterator->isReadable() && 
                    $iterator->current()->getExtension() === 'php'
                ) {
                    require $iterator->key();
                }

                $iterator->next();
            }
        } catch (Exception $e) {
            echo $e->getMessage();
        }
    }
}

if (! function_exists('includeRouteFiles')) {

    /**
     * @param $folder
     */
    function includeRouteFiles($folder)
    {
        includeFilesInFolder($folder);
    }
}
