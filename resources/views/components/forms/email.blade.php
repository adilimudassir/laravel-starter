<input type="email" {{ $attributes->merge(['class' => 'form-control']) }} />

@error('email')
    <span class="invalid-feedback" role="alert">
        <strong>{{ $message }}</strong>
    </span>
@enderror