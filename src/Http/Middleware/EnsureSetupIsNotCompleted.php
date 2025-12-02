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
        // Cek 1: Apakah Konfigurasi Dasar sudah ada? (Misal: site_name)
        // Kita cek di DB settings ATAU di Environment
        $configExists = FuturismeSetting::where('key', 'site_name')->exists() || env('FUTURISME_SITE_NAME');

        // Cek 2: Apakah Admin sudah ada?
        $adminExists = FuturismeAdmin::exists();

        // Jika CONFIG sudah ada DAN ADMIN sudah ada, maka Setup dianggap SELESAI.
        // Blokir akses ke halaman setup.
        if ($configExists && $adminExists) {
            // Opsional: Redirect ke login atau tampilkan 404 agar url tersembunyi
            return redirect()->route('futurisme.login'); 
            // atau abort(404);
        }

        return $next($request);
    }
}