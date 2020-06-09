<?php

namespace Domains\Auth\Listeners;

use Domains\Auth\Events\UserLoggedIn;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class UserEventSubscriber
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * @param $event
     */
    public function onLoggedIn($event)
    {
        // Update the logging in users time & IP
        $event->user->update([
            'last_login_at' => now(),
            'last_login_ip' => request()->getClientIp(),
        ]);
    }

    /**
     * Register the listeners for the subscriber.
     *
     * @param \Illuminate\Events\Dispatcher $events
     */
    public function subscribe($events)
    {
        $events->listen(
            UserLoggedIn::class,
            'Domains\Auth\Listeners\UserEventListener@onLoggedIn'
        );
    }
}
