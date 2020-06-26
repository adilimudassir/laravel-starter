
    <x-utils.action-button 
        name="view" 
        :href="route('backend.users.show', $model)" 
        permission="read-users"
        class="btn btn-info btn-sm" 
        icon="fas fa-search"
    />
    <x-utils.action-button 
        name="edit" 
        :href="route('backend.users.edit', $model)" 
        permission="update-users" 
        class="btn btn-success btn-sm"
        icon="fas fa-edit"
    />
    {{--
    @if (! $model->isActive())
        <x-utils.link
            :href="route('backend.auth.users.mark', [$model, 1])"
            class="btn btn-primary btn-sm"
            icon="fas fa-sync-alt"
            :text="__('Restore')"
            name="confirm-item"
            permission="access.users.reactivate" />
    @endif
    --}}
    @if ($model->id !== 1 && $model->id !== auth()->id())
        <x-utils.delete-button 
            :href="route('backend.users.delete', $model)" 
            permission="delete-users" 
            class="btn btn-danger btn-sm" 
            icon="fas fa-trash"
        />
    @endif

    @if ($model->isActive())
        <div class="dropdown d-inline-block">
            <a class="btn btn-sm btn-secondary dropdown-toggle" id="dropdownMenuLink" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                More
            </a>

            <div class="dropdown-menu" aria-labelledby="dropdownMenuLink" style="margin: 0px;">
                <a class="dropdown-item" href="#">Clear Session</a>
                <a class="dropdown-item" href="#">Login As {{ $model->name }}</a>
                <a class="dropdown-item" href="#">Change Password</a>
                {{--
                @if ($model->id !== 1 && $model->id !== auth()->id())
                    <x-utils.link
                        :href="route('backend.auth.users.mark', [$model, 0])"
                        class="dropdown-item"
                        :text="__('Deactivate')"
                        name="confirm-item"
                        permission="access.users.deactivate" />
                @endif
                --}}
            </div>
        </div>
    @endif