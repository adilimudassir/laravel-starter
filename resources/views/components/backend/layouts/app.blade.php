<x-layouts.app :title="$title">
    <x-slot name="styles">
        {{ $before_styles ?? null }}
        <link href="{{ mix('css/backend.css') }}" rel="stylesheet">
        {{ $after_styles ?? null }}
    </x-slot>
    <x-backend.partials.navbar />
    {{ Breadcrumbs::render() }}
    <main class="">
        @include('partials.messages')
        {{ $slot }}
    </main>    
    <x-backend.partials.footer />
    <x-slot name="scripts">
        {{ $before_scripts ?? null }}
        <script src="{{ mix('js/manifest.js') }}"></script>
        <script src="{{ mix('js/vendor.js') }}"></script>
        <script src="{{ mix('js/backend.js') }}"></script>
        {{ $after_scripts ?? null }}
    </x-slot>
</x-layouts.app>