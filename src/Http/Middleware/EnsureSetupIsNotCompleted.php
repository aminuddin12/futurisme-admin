<?php

namespace Aminuddin12\FuturismeAdmin\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Aminuddin12\FuturismeAdmin\Models\FuturismeSetting;
use Aminuddin12\FuturismeAdmin\Models\FuturismeAdmin;
use Symfony\Component\HttpFoundation\Response;

class EnsureSetupIsNotCompleted
{
    public function handle(Request $request, Closure $next): Response
    {
        // Cek apakah Admin sudah ada (tanda setup selesai)
        try {
            $adminExists = FuturismeAdmin::exists();
        } catch (\Exception $e) {
            $adminExists = false;
        }

        // Jika setup SUDAH selesai, jangan biarkan akses ke halaman setup lagi.
        // Redirect ke login atau dashboard.
        if ($adminExists) {
            return redirect()->route('futurisme.login');
        }

        return $next($request);
    }
}