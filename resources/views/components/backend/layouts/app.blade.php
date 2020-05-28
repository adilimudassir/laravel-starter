<x-layouts.app :title="$title">
    <x-backend.partials.navbar />
    <main class="py-4">
        {{ $slot }}
    </main>    
    <x-backend.partials.footer />
</x-layouts.app>