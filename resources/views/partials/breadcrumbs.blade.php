@if($breadcrumbs)
    <ol class="">
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
