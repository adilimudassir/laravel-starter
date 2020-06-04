<x-layouts.app :title="$title">
    <x-backend.partials.navbar />
    {{ Breadcrumbs::render() }}
    <main class="py-4">
        {{ $slot }}
    </main>    
    <x-backend.partials.footer />
</x-layouts.app>