<?php

namespace Aminuddin12\FuturismeAdmin\Http\Controllers\Admin;

use Aminuddin12\FuturismeAdmin\Http\Controllers\FuturismeBaseController;
use Aminuddin12\FuturismeAdmin\Models\FuturismeRole;
use Aminuddin12\FuturismeAdmin\Models\FuturismePermission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleController extends FuturismeBaseController
{
    public function index()
    {
        $roles = FuturismeRole::with('permissions')->paginate(10);
        return Inertia::render('Admin/Roles/Index', ['roles' => $roles]);
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|unique:futurisme_roles,name']);
        $role = FuturismeRole::create(['name' => $request->name]);
        
        if ($request->has('permissions')) {
            $role->permissions()->sync($request->permissions);
        }

        return back()->with('success', 'Role created successfully');
    }

    // ... edit, update, destroy logic ...
}