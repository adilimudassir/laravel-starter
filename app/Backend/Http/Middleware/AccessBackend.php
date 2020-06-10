<?php
namespace Backend\Http\Middleware;

use Closure;

class AccessBackend
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if ( !auth()->user()->can('access-backend') ) {
            return redirect(home_route());
        }
        return $next($request);
    }
}