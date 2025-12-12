<?php

namespace Aminuddin12\FuturismeAdmin\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Illuminate\Support\Facades\Log;
use Aminuddin12\FuturismeAdmin\Models\FuturismeSidebar;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Schema;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'futurisme::app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user('futurisme');
        
        // -----------------------------------------------------------
        // MODE PENGUNJUNG (GUEST MODE)
        // -----------------------------------------------------------
        if (!$user) {
            return array_merge(parent::share($request), [
                'auth' => ['user' => null],
                
                'config' => [
                    'app_name' => Config::get('fu-admin.app.name', 'Futurisme Admin'),
                    'logo_url' => Config::get('fu-admin.system.logo_url'),
                    'theme' => [
                        'color_primary' => Config::get('fu-admin.theme.color_primary', '#4f46e5'),
                    ]
                ],
                
                'menus' => [],
                
                'flash' => [
                    'success' => fn () => $request->session()->get('success'),
                    'error' => fn () => $request->session()->get('error'),
                ],
                
                'ziggy' => function () use ($request) {
                    return [
                        'url' => $request->url(),
                        'port' => null,
                        'defaults' => [],
                        'routes' => [],
                        'location' => $request->url(),
                    ];
                },
            ]);
        }

        // -----------------------------------------------------------
        // MODE AUTHENTICATED (ADMIN MODE)
        // -----------------------------------------------------------
        
        $safeUser = [
            'name' => $user->name,
            'email' => $user->email,
            'avatar' => $user->avatar_url,
            'roles' => method_exists($user, 'getRoleNames') ? $user->getRoleNames() : ($user->roles ? $user->roles->pluck('name') : []),
            'permissions' => method_exists($user, 'getAllPermissions') 
                ? $user->getAllPermissions()->pluck('name') 
                : (method_exists($user, 'permissions') ? $user->permissions->pluck('name') : []),
        ];

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $safeUser,
            ],
            'config' => [
                'app_name' => Config::get('fu-admin.app.name', 'Futurisme Admin'),
                'logo_url' => Config::get('fu-admin.system.logo_url'),
                'admin_prefix' => Config::get('fu-admin.admin_url_prefix', 'admin'),
                'theme' => [
                    'color_primary' => Config::get('fu-admin.theme.color_primary', '#4f46e5'),
                ]
            ],
            'menus' => $this->getSafeSidebarMenu(),
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'warning' => fn () => $request->session()->get('warning'),
                'status' => fn () => $request->session()->get('status'),
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
                        Log::error('[Futurisme] Ziggy Error: ' . $e->getMessage());
                    }
                }
                
                $ziggyConfig['location'] = $request->url();
                return $ziggyConfig;
            },
        ]);
    }

    protected function getSafeSidebarMenu()
    {
        try {
            if (!Schema::hasTable('futurisme_sidebars')) {
                return [];
            }

            $rawMenus = FuturismeSidebar::where('is_active', '!=', 0)
                ->whereNull('parent_id')
                ->with(['children' => function($q) {
                    $q->where('is_active', '!=', 0)->orderBy('order');
                }])
                ->orderBy('group')
                ->orderBy('order')
                ->get();

            return $rawMenus->map(function ($item) {
                return [
                    'id' => $item->id,
                    'title' => $item->title,
                    'group' => $item->group,
                    'icon' => $item->icon,
                    'route' => $item->route,
                    'url' => $item->url,
                    'children' => $item->children->map(function ($child) {
                        return [
                            'id' => $child->id,
                            'title' => $child->title,
                            'icon' => $child->icon,
                            'route' => $child->route,
                            'url' => $child->url,
                        ];
                    }),
                ];
            });
        } catch (\Exception $e) {
            return [];
        }
    }
}