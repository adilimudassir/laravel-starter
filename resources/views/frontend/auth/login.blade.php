<x-frontend.layouts.app>
    <x-slot name="title">
        Login
    </x-slot>
    <x-forms.post :action="route('frontend.auth.login')">
        <x-forms.group labelClass="" bodyClass="" for="email"
            :label="'E-mail Address'">
            <x-forms.email name="email" id="email" :value="old('email')" required autocomplete="email" autofocus />
        </x-forms.group>

        <x-forms.group labelClass="" bodyClass="" for="password"
            :label="'Password'">
            <x-forms.password name="password" id="password" required autocomplete="current-password" />
        </x-forms.group>

        <x-forms.group noLabel="true" bodyClass="">
            <x-forms.form-check name="remember" id="remember" :checked="old('remember')" :label="'Remember Me'" />
        </x-forms.group>

        <x-forms.group :noLabel="true" groupClass="f" bodyClass="">
            <x-forms.submit class="b" :text="'Login'" />
            <x-utils.link :href="route('frontend.auth.password.request')" class="btn btn-link"
                :text="'Forgot Your Password?'" />
        </x-forms.group>
    </x-forms.post>
</x-frontend.layouts.app>