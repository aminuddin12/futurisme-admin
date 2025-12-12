<?php

namespace Aminuddin12\FuturismeAdmin\Http\Controllers\Admin;

use Aminuddin12\FuturismeAdmin\Http\Controllers\FuturismeBaseController;
use Aminuddin12\FuturismeAdmin\Models\FuturismeSidebar;
use Aminuddin12\FuturismeAdmin\Models\FuturismePermission;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\DB;

class SidebarController extends FuturismeBaseController
{
    public function index()
    {
        if (Gate::denies('manage sidebar')) abort(403);
        $rawMenus = FuturismeSidebar::orderBy('by_module', 'desc')
                    ->orderBy('group')
                    ->orderBy('order')
                    ->get();

        $modules = $rawMenus->groupBy('by_module')->map(function ($items, $moduleName) {
            return [
                'module_name' => $moduleName ?? 'Unknown',
                'items' => $items->values() 
            ];
        })->values();

        $allParents = FuturismeSidebar::whereNull('parent_id')->orderBy('title')->get(['id', 'title']);
        $permissions = FuturismePermission::orderBy('name')->get(['name']);
        $existingGroups = FuturismeSidebar::select('group')->distinct()->pluck('group');

        return Inertia::render('Admin/Sidebar/Index', [
            'modules_data' => $modules,
            'parents' => $allParents,
            'permissions' => $permissions,
            'existing_groups' => $existingGroups
        ]);
    }

    public function store(Request $request)
    {
        if (Gate::denies('manage sidebar')) abort(403);

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'url' => 'nullable|string',
            'route' => 'nullable|string',
            'icon' => 'nullable|string',
            'parent_id' => 'nullable|exists:futurisme_sidebars,id',
            'permission_name' => 'nullable|string',
            'is_active' => 'required|integer',
            'group' => 'required|string',
            'by_module' => 'nullable|string',
            'order' => 'integer'
        ]);

        if (empty($data['by_module'])) {
            $data['by_module'] = 'aminuddin12/futurisme-admin';
        }

        if (!isset($data['order'])) {
            $maxOrder = FuturismeSidebar::where('by_module', $data['by_module'])
                ->max('order');
            $data['order'] = $maxOrder + 1;
        }

        $data['add_by'] = auth()->user()->name ?? 'system';

        FuturismeSidebar::create($data);

        return back()->with('success', 'Menu added successfully');
    }

    public function update(Request $request, $id)
    {
        if (Gate::denies('manage sidebar')) abort(403);

        $menu = FuturismeSidebar::findOrFail($id);

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'url' => 'nullable|string',
            'route' => 'nullable|string',
            'icon' => 'nullable|string',
            'parent_id' => 'nullable|exists:futurisme_sidebars,id',
            'permission_name' => 'nullable|string',
            'is_active' => 'required|integer',
            'group' => 'required|string',
            'by_module' => 'required|string'
        ]);

        if ($data['parent_id'] == $id) {
            return back()->with('error', 'Cannot set parent to self');
        }

        $menu->update($data);

        return back()->with('success', 'Menu updated successfully');
    }

    public function destroy($id)
    {
        if (Gate::denies('manage sidebar')) abort(403);

        $menu = FuturismeSidebar::findOrFail($id);

        if ($menu->is_active === 0 || $menu->is_active === 1) {
            return back()->with('error', 'System menus cannot be deleted.');
        }

        $menu->delete();

        return back()->with('success', 'Menu deleted successfully');
    }

    public function reorder(Request $request)
    {
        if (Gate::denies('manage sidebar')) abort(403);

        $request->validate([
            'items' => 'required|array',
            'module_name' => 'required|string'
        ]);

        DB::transaction(function () use ($request) {
            $items = $request->items;
            $moduleName = $request->module_name;
            $currentGroup = 'general';

            foreach ($items as $index => $item) {
                if (isset($item['type']) && $item['type'] === 'divider') {
                    $currentGroup = $item['group_name'];
                    continue;
                }

                if (isset($item['id'])) {
                    FuturismeSidebar::where('id', $item['id'])->update([
                        'order' => $index,
                        'group' => $currentGroup,
                        'by_module' => $moduleName,
                        'parent_id' => $item['parent_id'] ?? null
                    ]);
                }
            }
        });

        return back()->with('success', 'Menu structure saved for ' . $request->module_name);
    }
}