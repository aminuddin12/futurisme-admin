<?php

namespace Aminuddin12\FuturismeAdmin\Http\Controllers;

use Illuminate\Routing\Controller;
use Inertia\Inertia;

class FuturismeBaseController extends Controller
{
    public function __construct()
    {
        // KUNCI PERBAIKAN:
        // Baris ini memaksa Laravel menggunakan file 'src/Resources/views/app.blade.php'
        // alih-alih 'resources/views/app.blade.php' milik project utama.
        Inertia::setRootView('futurisme::app');
    }
}