<?php

namespace Aminuddin12\FuturismeAdmin\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Illuminate\Support\Facades\Log;
use Aminuddin12\FuturismeAdmin\Models\FuturismeSidebar; // Pastikan Model diimport

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'futurisme::app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = null;
        try {
            if (config('auth.guards.futurisme')) {
                $user = $request->user('futurisme');
            }
        } catch (\Exception $e) {}

        // --- LOGIKA PENGAMBILAN MENU DARI DATABASE ---
        $menus = [];
        if ($user) {
            try {
                // Pastikan tabel ada sebelum query (untuk menghindari error saat migrasi awal)
                if (\Illuminate\Support\Facades\Schema::hasTable('futurisme_sidebars')) {
                    // Ambil Root Menu (parent_id IS NULL) beserta anak-anaknya
                    $menus = FuturismeSidebar::whereNull('parent_id')
                        ->with(['children' => function($query) {
                            $query->orderBy('order', 'asc'); // Urutkan submenu
                        }])
                        ->orderBy('order', 'asc') // Urutkan root menu
                        ->get();
                }
            } catch (\Exception $e) {
                Log::error('[Futurisme] Gagal memuat sidebar menu: ' . $e->getMessage());
            }
        }
        // -------------------------------------------

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $user,
            ],
            'menus' => $menus, // Kirim data menu ke frontend
            'config' => [
                'url_prefix' => config('fu-admin.url_prefix', 'admin'),
                'site_name' => config('fu-admin.site_name'),
                'can_register' => config('fu-admin.auth.can_register'),
            ],
            'ziggy' => function () use ($request) {
                $ziggyConfig = [
                    'url' => $request->url(),
                    'port' => null,
                    'defaults' => [],
                    'routes' => [],
                    'location' => $request->url(),
                ];
                
                $ziggyClass = '\Tightenco\Ziggy\Ziggy';
                
                if (class_exists($ziggyClass)) {
                    try {
                        $ziggy = new $ziggyClass;
                        $ziggyConfig = array_merge($ziggyConfig, $ziggy->toArray());
                    } catch (\Exception $e) {
                        Log::error('[Futurisme] Ziggy Instantiation Failed: ' . $e->getMessage());
                    }
                }
                
                $ziggyConfig['location'] = $request->url();
                return $ziggyConfig;
            },
            'flash' => [
                'message' => fn () => $request->session()->get('message'),
                'error'   => fn () => $request->session()->get('error'),
                'success' => fn () => $request->session()->get('success'),
                'status'  => fn () => $request->session()->get('status'),
            ],
        ]);
    }
}