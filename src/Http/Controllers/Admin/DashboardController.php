<?php

namespace Aminuddin12\FuturismeAdmin\Http\Controllers\Admin;

use Aminuddin12\FuturismeAdmin\Http\Controllers\FuturismeBaseController;
use Inertia\Inertia;

class DashboardController extends FuturismeBaseController
{
    public function index()
    {
        return Inertia::render('Dashboard', [
            // Kirim data tambahan jika diperlukan, misalnya statistik atau konfigurasi khusus halaman ini
            'stats' => [
                'users' => 1240, // Contoh data, nanti bisa ambil dari model
                'revenue' => 84200,
                'pending_issues' => 23,
                'errors' => 5,
            ]
        ])->rootView('futurisme::app');
    }
}