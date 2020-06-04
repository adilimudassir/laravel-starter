@if($breadcrumbs)
    <ol class="">
        <li class="">
            <x-utils.link :href="route('frontend.index')" :text="'Home'" />
        </li>

        @foreach($breadcrumbs as $breadcrumb)
            @if($breadcrumb->url && !$loop->last)
                <li class="">
                    <x-utils.link :href="$breadcrumb->url" :text="$breadcrumb->title" />
            @else
                <li class="active">{{ $breadcrumb->title }}</li>
            @endif
        @endforeach
    </ol>
@endif
