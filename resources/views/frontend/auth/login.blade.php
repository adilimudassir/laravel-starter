<x-frontend.layouts.app>
    <x-slot name="title">
        Login
    </x-slot>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">Login</div>

                    <div class="card-body">
                        <x-forms.post :action="route('frontend.auth.login')">
                            <x-forms.group for="email" labelClass="col-md-4 col-form-label text-md-right" bodyClass="col-md-6" :label="'E-mail Address'">
                                <x-forms.email name="email" id="email" :value="old('email')" required
                                    autocomplete="email" autofocus />
                            </x-forms.group>

                            <x-forms.group for="password" labelClass="col-md-4 col-form-label text-md-right" bodyClass="col-md-6" :label="'Password'">
                                <x-forms.password name="password" id="password" required
                                    autocomplete="current-password" />
                            </x-forms.group>

                            <x-forms.group bodyClass="col-md-6 offset-md-4" noLabel="true">
                                <x-forms.form-check name="remember" id="remember" :checked="old('remember')"
                                    :label="'Remember Me'" />
                            </x-forms.group>

                            <x-forms.group bodyClass="col-md-8 offset-md-4" :noLabel="true">
                                <x-forms.submit class="btn btn-primary" :text="'Login'" />
                                <x-utils.link :href="route('frontend.auth.password.request')" class="btn btn-link"
                                    :text="'Forgot Your Password?'" />
                            </x-forms.group>
                        </x-forms.post>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-frontend.layouts.app>