<?php

namespace Aminuddin12\FuturismeAdmin\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Illuminate\Support\Facades\Auth;
use Aminuddin12\FuturismeAdmin\Models\FuturismeSidebar;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'futurisme::app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        // Ambil user dari guard 'futurisme' dengan aman
        $user = null;
        try {
            // Kita coba akses user hanya jika guard terdefinisi
            // Ini mencegah error "Auth guard [...] is not defined"
            if (config('auth.guards.futurisme')) {
                $user = $request->user('futurisme');
            }
        } catch (\Exception $e) {
            // Silent fail jika terjadi masalah config auth
        }

        // Ambil Menu Sidebar (Hierarkis)
        $menus = [];
        if ($user) {
            // Logic sederhana: Ambil semua root menu, load children
            // Nanti bisa ditambahkan filter permission di sini atau di model scope
            try {
                $menus = FuturismeSidebar::whereNull('parent_id')
                            ->with('children')
                            ->orderBy('order')
                            ->get();
            } catch (\Exception $e) {}
        }

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $user,
            ],
            'menus' => $menus,
            // Kirim Config Penting ke Frontend
            'config' => [
                'url_prefix' => config('fu-admin.url_prefix', 'admin'),
                'site_name' => config('fu-admin.site_name'),
                'theme.color_scheme' => config('fu-admin.theme.color_scheme', 'light'),
                'can_register' => config('fu-admin.auth.can_register'),
            ],
            'ziggy' => function () use ($request) {
                $ziggyConfig = [];
                // Defensive Coding: Check if Ziggy class exists before using it
                // Gunakan string class name agar parser PHP tidak error jika class tidak ada
                $ziggyClass = '\Tightenco\Ziggy\Ziggy';
                
                if (class_exists($ziggyClass)) {
                    try {
                        // Instansiasi menggunakan variable string class name
                        $ziggy = new $ziggyClass;
                        $ziggyConfig = $ziggy->toArray();
                    } catch (\Exception $e) {
                        // Silent fail if Ziggy throws an internal error
                    }
                }
                return array_merge($ziggyConfig, ['location' => $request->url()]);
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