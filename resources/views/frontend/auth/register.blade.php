<x-frontend.layouts.app>
    <x-slot name="title">
        Login
    </x-slot>
    <x-forms.post :action="route('frontend.auth.register')">
        <x-forms.group labelClass="" bodyClass="" for="name"
            :label="'Name'">
            <x-forms.text name="name" id="name" :value="old('name')" required autocomplete="name" autofocus />
        </x-forms.group>

        <x-forms.group labelClass="" bodyClass="" for="email"
            :label="'E-mail Address'">
            <x-forms.email name="email" id="email" :value="old('email')" required autocomplete="email" />
        </x-forms.group>

        <x-forms.group labelClass="" bodyClass="" for="password"
            :label="'Password'">
            <x-forms.password name="password" id="password" required autocomplete="new-password" />
        </x-forms.group>

        <x-forms.group labelClass="" bodyClass="" for="password_confirmation"
            :label="'Confirm Password'">
            <x-forms.password name="password_confirmation" id="password_confirmation" required
                autocomplete="new-password" />
        </x-forms.group>

        <x-forms.group :noLabel="true" groupClass="" bodyClass="">
            <x-forms.submit class="" :text="'Register'" />
        </x-forms.group>
    </x-forms.post>
</x-frontend.layouts.app>