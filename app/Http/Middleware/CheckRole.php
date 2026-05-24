<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    // app/Http/Middleware/CheckRole.php
public function handle(Request $request, Closure $next, string $role)
{
    if ($request->user()->role !== $role) {
        return response()->json(['message' => 'Accès refusé'], 403);
    }
    return $next($request);
}
}
