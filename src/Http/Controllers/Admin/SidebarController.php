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
    public function __construct()
    {
        // 
    }

    public function index()
    {
        if (Gate::denies('manage sidebar')) {
            abort(403, 'Unauthorized action.');
        }

        // Ambil semua item root, urutkan berdasarkan module, lalu group, lalu order
        $rawMenus = FuturismeSidebar::whereNull('parent_id')
                    ->with(['children' => function($q) {
                        $q->orderBy('order');
                        $q->with('children'); // Support depth lebih dari 1 level jika perlu
                    }])
                    ->orderBy('by_module', 'desc') // Module utama biasanya di atas
                    ->orderBy('group')
                    ->orderBy('order')
                    ->get();

        // Transform data untuk memudahkan frontend grouping
        // Struktur: Module -> Groups -> Items
        $groupedMenus = $rawMenus->groupBy('by_module')->map(function ($moduleItems, $moduleName) {
            return [
                'module_name' => $moduleName ?? 'Unknown Module',
                'groups' => $moduleItems->groupBy('group')->map(function ($groupItems, $groupName) {
                    return [
                        'group_name' => $groupName,
                        'items' => $groupItems->values()
                    ];
                })->values()
            ];
        })->values();

        $allParents = FuturismeSidebar::whereNull('parent_id')->orderBy('title')->get(['id', 'title']);
        $permissions = FuturismePermission::orderBy('name')->get(['name']);
        
        // Ambil list unik group untuk autocomplete/dropdown
        $existingGroups = FuturismeSidebar::select('group')->distinct()->pluck('group');

        return Inertia::render('Admin/Sidebar/Index', [
            'grouped_menus' => $groupedMenus,
            'parents' => $allParents,
            'permissions' => $permissions,
            'existing_groups' => $existingGroups
        ]);
    }

    public function store(Request $request)
    {
        if (Gate::denies('manage sidebar')) {
            abort(403);
        }

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'url' => 'nullable|string',
            'route' => 'nullable|string',
            'icon' => 'nullable|string',
            'parent_id' => 'nullable|exists:futurisme_sidebars,id',
            'permission_name' => 'nullable|string',
            'is_active' => 'required|integer',
            'group' => 'required|string', // Group wajib ada
            'by_module' => 'nullable|string',
            'order' => 'integer'
        ]);

        // Default module jika tidak diisi
        if (empty($data['by_module'])) {
            $data['by_module'] = 'aminuddin12/futurisme-admin';
        }

        // Auto order: taruh di paling bawah dalam group yang sama
        if (!isset($data['order'])) {
            $maxOrder = FuturismeSidebar::where('group', $data['group'])
                ->where('parent_id', $request->parent_id)
                ->max('order');
            $data['order'] = $maxOrder + 1;
        }

        // Logic Add By
        $data['add_by'] = auth()->user()->name ?? 'system';

        FuturismeSidebar::create($data);

        return back()->with('success', 'Menu added successfully');
    }

    public function update(Request $request, $id)
    {
        if (Gate::denies('manage sidebar')) {
            abort(403);
        }

        $menu = FuturismeSidebar::findOrFail($id);

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'url' => 'nullable|string',
            'route' => 'nullable|string',
            'icon' => 'nullable|string',
            'parent_id' => 'nullable|exists:futurisme_sidebars,id',
            'permission_name' => 'nullable|string',
            'is_active' => 'required|integer',
            'group' => 'required|string'
        ]);

        if ($data['parent_id'] == $id) {
            return back()->with('error', 'Cannot set parent to self');
        }

        // Proteksi active state
        // Jika status sekarang 0 atau 1, user tidak bisa ubah sembarangan kecuali logic tertentu?
        // Sesuai request: menu dapat diedit statusnya di level manapun, 
        // tapi logika 'add_by' pada is_active 2,3,4 berubah.
        
        if (in_array($data['is_active'], [2, 3, 4])) {
             // Update add_by logic jika perlu, misal ambil dari role
             // $menu->add_by = ... (sesuai request, dari tabel model_has_roles, tapi ini logic kompleks yang butuh detail user)
             // Untuk sementara kita biarkan default update behavior
        }

        $menu->update($data);

        return back()->with('success', 'Menu updated successfully');
    }

    public function destroy($id)
    {
        if (Gate::denies('manage sidebar')) {
            abort(403);
        }

        $menu = FuturismeSidebar::findOrFail($id);

        // Logic 5: is_active 0 atau 1 TIDAK DAPAT DIHAPUS
        if ($menu->is_active === 0 || $menu->is_active === 1) {
            return back()->with('error', 'System menus (active status 0 or 1) cannot be deleted.');
        }

        $menu->delete();

        return back()->with('success', 'Menu deleted successfully');
    }

    public function reorder(Request $request)
    {
        if (Gate::denies('manage sidebar')) {
            abort(403);
        }

        $request->validate([
            'items' => 'required|array', // Structure: Module -> Group -> Items
        ]);

        DB::transaction(function () use ($request) {
            $modules = $request->items;

            foreach ($modules as $module) {
                $moduleName = $module['module_name'];
                
                foreach ($module['groups'] as $group) {
                    $groupName = $group['group_name'];
                    
                    if (!empty($group['items'])) {
                        $this->processReorderItems($group['items'], null, $moduleName, $groupName);
                    }
                }
            }
        });

        return back()->with('success', 'Menu structure updated');
    }

    /**
     * Rekursif function untuk update order, parent, module, dan group
     */
    private function processReorderItems($items, $parentId, $moduleName, $groupName)
    {
        foreach ($items as $index => $item) {
            FuturismeSidebar::where('id', $item['id'])->update([
                'order' => $index + 1,
                'parent_id' => $parentId,
                'by_module' => $moduleName, // Update module jika dipindah (walaupun UI mungkin melarang)
                'group' => $groupName       // PENTING: Update group jika item dipindah ke group lain
            ]);

            if (isset($item['children']) && !empty($item['children'])) {
                // Children mewarisi module dan group dari parent/root
                $this->processReorderItems($item['children'], $item['id'], $moduleName, $groupName);
            }
        }
    }
}