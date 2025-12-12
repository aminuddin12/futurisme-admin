<?php

namespace Aminuddin12\FuturismeAdmin\Http\Controllers;

use Illuminate\Http\Request;
use Aminuddin12\FuturismeAdmin\Models\FuturismeVisit;
use Illuminate\Support\Facades\Auth;

class FuturismeTrackerController extends FuturismeBaseController
{
    public function store(Request $request)
    {
        $payload = $request->json()->all();

        $visit = FuturismeVisit::create([
            'session_id' => $request->session()->getId(),
            'user_id' => Auth::guard('futurisme')->id() ?? Auth::id(),
            'ip_address' => $request->ip(),
            'method' => $request->method(),
            'url' => $payload['url'] ?? $request->fullUrl(),
            'referer' => $payload['referrer'] ?? $request->header('referer'),
            'user_agent' => $request->userAgent(),
            'device' => $this->getDevice($request->userAgent()),
            'platform' => $this->getPlatform($request->userAgent()),
            'browser' => $this->getBrowser($request->userAgent()),
            'location' => $payload['location'] ?? null,
            'cookies' => $payload['cookies'] ?? [],
        ]);

        return response()->json(['status' => 'recorded']);
    }

    protected function getDevice($ua)
    {
        if (preg_match('/(tablet|ipad|playbook)|(android(?!.*(mobi|opera mini)))/i', $ua)) return 'Tablet';
        if (preg_match('/(up.browser|up.link|mmp|symbian|smartphone|midp|wap|phone|android|iemobile)/i', $ua)) return 'Mobile';
        return 'Desktop';
    }

    protected function getPlatform($ua)
    {
        if (preg_match('/linux/i', $ua)) return 'Linux';
        if (preg_match('/macintosh|mac os x/i', $ua)) return 'Mac';
        if (preg_match('/windows|win32/i', $ua)) return 'Windows';
        return 'Unknown';
    }

    protected function getBrowser($ua)
    {
        if (preg_match('/MSIE/i', $ua) && !preg_match('/Opera/i', $ua)) return 'Internet Explorer';
        if (preg_match('/Firefox/i', $ua)) return 'Firefox';
        if (preg_match('/Chrome/i', $ua)) return 'Chrome';
        if (preg_match('/Safari/i', $ua)) return 'Safari';
        if (preg_match('/Opera/i', $ua)) return 'Opera';
        return 'Unknown';
    }
}