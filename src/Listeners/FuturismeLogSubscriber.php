<?php

namespace Aminuddin12\FuturismeAdmin\Listeners;

use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Illuminate\Events\Dispatcher;

class FuturismeLogSubscriber
{
    public function handleLogin($event)
    {
        if ($this->isFuturismeAdmin($event->user)) {
            activity('auth')
                ->causedBy($event->user)
                ->withProperties([
                    'ip' => request()->ip(),
                    'agent' => request()->userAgent()
                ])
                ->event('login')
                ->log('Admin logged in');
                
            $event->user->update([
                'last_login_at' => now(),
                'last_login_ip' => request()->ip()
            ]);
        }
    }

    public function handleLogout($event)
    {
        if ($event->user && $this->isFuturismeAdmin($event->user)) {
            activity('auth')
                ->causedBy($event->user)
                ->event('logout')
                ->log('Admin logged out');
        }
    }

    protected function isFuturismeAdmin($user)
    {
        return $user && method_exists($user, 'getTable') && $user->getTable() === 'futurisme_admins';
    }

    public function subscribe(Dispatcher $events): void
    {
        $events->listen(Login::class, [self::class, 'handleLogin']);
        $events->listen(Logout::class, [self::class, 'handleLogout']);
    }
}