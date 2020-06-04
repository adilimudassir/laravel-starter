@if (isset($permission))
    @if (auth()->user()->can($permission))
        <x-utils.link :href="$href" class="" icon="" :text="'View'" />
    @endif
@else
    <x-utils.link :href="$href" class="" icon="" :text="'View'" />
@endif
