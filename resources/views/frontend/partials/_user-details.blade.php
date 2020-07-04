<x-frontend.partials.tabs>
        <x-slot name="headers">
            <x-frontend.partials.tab-header id="overview" :active="true">
                Overview
            </x-frontend.partials.tab-header>
        </x-slot>
        <x-slot name="contents">
            <x-frontend.partials.tab-content id="overview" :active="true">
                <table class="table table-bordered">
                    <tr>
                        <th>Name</th>
                        <td>{{ $user->name }}</td>
                    </tr>
                    <tr>
                        <th>Email</th>
                        <td>{{ $user->email }}</td>
                    </tr>
                    <tr>
                        <th>Status</th>
                        <td>
                            <x-frontend.partials.badge 
                                :type="$user->isActive() ? 'success' : 'danger'" 
                                :name="$user->isActive() ? 'Active' : 'Inactive'" 
                            />
                        </td>
                    </tr>
                    <tr>
                        <th>Confirmed</th>
                        <td>
                            <x-frontend.partials.badge 
                                :type="$user->hasVerifiedEmail() ? 'success' : 'danger'" 
                                :name="$user->hasVerifiedEmail() ? 'Yes' : 'No'" 
                            />
                        </td>
                    </tr>
                    <tr>
                        <th>Last Login Date</th>
                        <td>{{ optional($user->last_login_at)->diffForHumans() }}</td>
                    </tr>
                    <tr>
                        <th>Last Login IP</th>
                        <td>{{ $user->last_login_ip }}</td>
                    </tr>
                </table>
            </x-frontend.partials.tab-content>
        </x-slot>
    </x-frontend.partials.tabs>