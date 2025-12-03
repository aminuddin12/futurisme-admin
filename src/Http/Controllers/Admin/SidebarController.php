<?php

namespace Aminuddin12\FuturismeAdmin\Http\Controllers\Admin;

use Aminuddin12\FuturismeAdmin\Http\Controllers\FuturismeBaseController;
use Aminuddin12\FuturismeAdmin\Models\FuturismeSidebar;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SidebarController extends FuturismeBaseController
{
    public function index()
    {
        // Ambil sidebar root saja, children di-load via relationship
        $menus = FuturismeSidebar::whereNull('parent_id')
                    ->with('children')
                    ->orderBy('order')
                    ->get();

        return Inertia::render('Admin/Sidebar/Index', ['menus' => $menus]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required',
            'url' => 'nullable',
            'icon' => 'nullable',
            'parent_id' => 'nullable|exists:futurisme_sidebars,id',
            'permission_name' => 'nullable',
            'order' => 'integer'
        ]);

        FuturismeSidebar::create($data);
        return back()->with('success', 'Menu added');
    }
}