<?php

namespace Domains\Auth\Events;

use Domains\Auth\Models\Role;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;

class RoleCreated
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
    * @var [role]
    */
    public $role;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(Role $role)
    {
        $this->role = $role;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('channel-name');
    }
}
