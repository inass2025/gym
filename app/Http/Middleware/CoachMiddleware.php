<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CoachMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        if (!in_array($user->role, ['coach', 'admin'])) {
            return response()->json(['message' => 'Accès refusé — Coach uniquement'], 403);
        }

        // Log activité
        \Log::info('Coach activity', [
            'coach_id' => $user->id,
            'coach'    => $user->prenom . ' ' . $user->nom,
            'route'    => $request->path(),
            'method'   => $request->method(),
            'ip'       => $request->ip(),
            'at'       => now()->toDateTimeString(),
        ]);

        return $next($request);
    }
}