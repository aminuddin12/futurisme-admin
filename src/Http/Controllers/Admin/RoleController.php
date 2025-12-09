<?php

namespace Aminuddin12\FuturismeAdmin\Http\Controllers\Admin;

use Aminuddin12\FuturismeAdmin\Http\Controllers\FuturismeBaseController;
use Aminuddin12\FuturismeAdmin\Models\FuturismeRole;
use Aminuddin12\FuturismeAdmin\Models\FuturismePermission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RoleController extends FuturismeBaseController
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Search query
        $search = $request->input('search');

        // Fetch Roles
        $roles = FuturismeRole::query()
            ->withCount('permissions')
            ->when($search, function ($q, $search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('guard_name', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10, ['*'], 'roles_page')
            ->withQueryString();

        // Fetch Permissions
        $permissions = FuturismePermission::query()
            ->when($search, function ($q, $search) {
                $q->where('name', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10, ['*'], 'permissions_page')
            ->withQueryString();

        return Inertia::render('Roles/Index', [
            'roles' => $roles,
            'permissions' => $permissions,
            'filters' => $request->only(['search'])
        ]);
    }

    /**
     * Store a newly created Role.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:futurisme_roles,name',
            'guard_name' => 'required|string|max:255',
        ]);

        FuturismeRole::create($validated);

        return redirect()->back()->with('success', 'Role berhasil dibuat.');
    }

    /**
     * Update the specified Role.
     */
    public function update(Request $request, $id)
    {
        $role = FuturismeRole::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:futurisme_roles,name,' . $role->id,
            'guard_name' => 'required|string|max:255',
        ]);

        $role->update($validated);

        return redirect()->back()->with('success', 'Role berhasil diperbarui.');
    }

    /**
     * Remove the specified Role.
     */
    public function destroy($id)
    {
        $role = FuturismeRole::findOrFail($id);
        
        // Prevent deleting critical roles (optional logic)
        if (in_array($role->name, ['super-admin', 'admin'])) {
            return redirect()->back()->with('error', 'Role sistem tidak dapat dihapus.');
        }

        $role->delete();

        return redirect()->back()->with('success', 'Role berhasil dihapus.');
    }

    // --- PERMISSION ACTIONS ---

    public function storePermission(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:futurisme_permissions,name',
            'guard_name' => 'required|string|max:255',
        ]);

        FuturismePermission::create($validated);

        return redirect()->back()->with('success', 'Permission berhasil dibuat.');
    }

    public function updatePermission(Request $request, $id)
    {
        $permission = FuturismePermission::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:futurisme_permissions,name,' . $permission->id,
            'guard_name' => 'required|string|max:255',
        ]);

        $permission->update($validated);

        return redirect()->back()->with('success', 'Permission berhasil diperbarui.');
    }

    public function destroyPermission($id)
    {
        $permission = FuturismePermission::findOrFail($id);
        $permission->delete();

        return redirect()->back()->with('success', 'Permission berhasil dihapus.');
    }
}