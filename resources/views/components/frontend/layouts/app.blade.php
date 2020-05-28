<x-layouts.app :title="$title">
    <x-frontend.partials.navbar />
    <main class="py-4">
        {{ $slot }}
    </main>    
    <x-frontend.partials.footer />
</x-layouts.app>