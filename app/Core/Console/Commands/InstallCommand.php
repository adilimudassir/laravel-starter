<?php

namespace App\Console\Commands;

use Composer\Composer;
use Illuminate\Console\Command;
use Symfony\Component\Process\Process;

class InstallCommand extends Command
{
    private $composer;
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:install';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Install Application';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(Composer $composer)
    {
        $this->composer = $composer;
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $composer = new Composer();
        $this->info('Installing');
        
        $this->info('');
        $this->info('Generating Application Key...');
        $this->call('key:generate');
        $this->info('Done!');

        $this->info('');
        $this->info('Migrating Database...');
        $this->call('migrate:fresh');
        $this->info('Done!');

        $this->info('');
        $this->info('Seeding Database Records...');
        $this->call('db:seed');
        $this->info('Done!');
        
        $this->info('');
        $this->info('Dumping the autoloaded files and reloading all new files');
        // $composer = $this->findComposer();

        $process = new Process(['composer dump']);
        $process->setWorkingDirectory(base_path())->run();
        $this->info('Successfully Installed MedEquip. Enjoy!');
    }
}
