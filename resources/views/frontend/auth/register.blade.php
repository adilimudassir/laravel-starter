<x-frontend.layouts.app>
    <x-slot name="title">
        Register
    </x-slot>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">Register</div>
                    <div class="card-body">
                        <x-forms.post :action="route('frontend.auth.register')">
                            <x-forms.group labelClass="col-md-4 col-form-label text-md-right" bodyClass="col-md-6" for="name" :label="'Name'">
                                <x-forms.text name="name" id="name" :value="old('name')" required autocomplete="name"
                                    autofocus />
                            </x-forms.group>

                            <x-forms.group labelClass="col-md-4 col-form-label text-md-right" bodyClass="col-md-6" for="email" :label="'E-mail Address'">
                                <x-forms.email name="email" id="email" :value="old('email')" required
                                    autocomplete="email" />
                            </x-forms.group>

                            <x-forms.group labelClass="col-md-4 col-form-label text-md-right" bodyClass="col-md-6" for="password" :label="'Password'">
                                <x-forms.password name="password" id="password" required autocomplete="new-password" />
                            </x-forms.group>

                            <x-forms.group labelClass="col-md-4 col-form-label text-md-right" bodyClass="col-md-6" for="password_confirmation"
                                :label="'Confirm Password'">
                                <x-forms.password name="password_confirmation" id="password_confirmation" required
                                    autocomplete="new-password" />
                            </x-forms.group>

                            <x-forms.group :noLabel="true" groupClass="form-group row mb-0" bodyClass="col-md-6 offset-md-4">
                                <x-forms.submit class="btn btn-success" :text="'Register'" />
                            </x-forms.group>
                        </x-forms.post>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-frontend.layouts.app>