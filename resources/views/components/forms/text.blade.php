<input type="text" {{ $attributes->merge(['class' => 'form-control']) }} />
@error($name)
    <span class="invalid-feedback" role="alert">
        <strong>{{ $message }}</strong>
    </span>
@enderror