import React, { useState, useEffect } from 'react';
import { Head, usePage, router, useForm } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import { Reorder, motion, AnimatePresence } from 'framer-motion';

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import Modal from '@/Components/UI/Modal';
import Checkbox from '@/Components/Checkbox';

// Tipe Data
interface SidebarItem {
    id: number;
    title: string;
    url?: string;
    route?: string;
    icon?: string;
    parent_id?: number;
    order: number;
    permission_name?: string;
    is_active: number;
    group: string;
    by_module: string;
    children?: SidebarItem[];
}

interface SidebarGroup {
    group_name: string;
    items: SidebarItem[];
}

interface SidebarModule {
    module_name: string;
    groups: SidebarGroup[];
}

interface PageProps {
    grouped_menus: SidebarModule[];
    parents: { id: number; title: string }[];
    permissions: { name: string }[];
    existing_groups: string[];
    config: any;
}

export default function SidebarIndex({ grouped_menus, parents, permissions, existing_groups }: PageProps) {
    const { config } = usePage().props as any;
    const rawPrimaryColor = config?.theme?.color_primary;
    const primaryColor = (rawPrimaryColor === 'default' || !rawPrimaryColor) ? '#4f46e5' : rawPrimaryColor;

    // State Utama
    const [modules, setModules] = useState<SidebarModule[]>(grouped_menus);
    
    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<SidebarItem | null>(null);
    
    // New Group Temp State (Frontend Only)
    const [newGroupName, setNewGroupName] = useState('');
    const [tempGroups, setTempGroups] = useState<string[]>([]);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        title: '',
        url: '',
        route: '',
        icon: '',
        parent_id: '',
        permission_name: '',
        is_active: 3, // Default active status 3 (User Created)
        group: 'general',
        by_module: 'aminuddin12/futurisme-admin',
        order: 0
    });

    useEffect(() => {
        setModules(grouped_menus);
    }, [grouped_menus]);

    // --- HANDLERS ---

    const handleCreateGroup = () => {
        if (!newGroupName.trim()) return;
        setTempGroups([...tempGroups, newGroupName]);
        setIsGroupModalOpen(false);
        setNewGroupName('');
        
        // Langsung buka modal add menu dengan group baru terpilih untuk memudahkan UX
        reset();
        setData((prev) => ({ ...prev, group: newGroupName }));
        setIsModalOpen(true);
    };

    const openModal = (item: SidebarItem | null = null, groupName: string = 'general', moduleName: string = '') => {
        setEditingItem(item);
        if (item) {
            setData({
                title: item.title,
                url: item.url || '',
                route: item.route || '',
                icon: item.icon || '',
                parent_id: item.parent_id ? String(item.parent_id) : '',
                permission_name: item.permission_name || '',
                is_active: item.is_active,
                group: item.group,
                by_module: item.by_module,
                order: item.order
            });
        } else {
            reset();
            setData((prev) => ({
                ...prev,
                group: groupName,
                by_module: moduleName || prev.by_module,
                is_active: 3 // Default for new items
            }));
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingItem) {
            put(route('futurisme.sidebar.update', editingItem.id), {
                onSuccess: () => setIsModalOpen(false)
            });
        } else {
            post(route('futurisme.sidebar.store'), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    // Bersihkan temp group jika berhasil disimpan (karena sekarang sudah ada di DB)
                    setTempGroups(tempGroups.filter(g => g !== data.group));
                }
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this menu?')) {
            destroy(route('futurisme.sidebar.destroy', id));
        }
    };

    const handleReorderGroup = (moduleIndex: number, groupIndex: number, newItems: SidebarItem[]) => {
        const newModules = [...modules];
        newModules[moduleIndex].groups[groupIndex].items = newItems;
        setModules(newModules);
    };

    const saveOrder = () => {
        const flattenedItems = modules.flatMap(module =>
            module.groups.flatMap((group, gIdx) =>
                group.items.map((item, itemIdx) => ({
                    id: item.id,
                    order: itemIdx,
                    group: group.group_name
                }))
            )
        );

        router.post(route('futurisme.sidebar.reorder'), {
            items: flattenedItems
        }, {
            preserveScroll: true
        });
    };

    // Logic Opsi Status
    const getStatusOptions = () => {
        // Jika sedang edit item System (0/1), hanya boleh switch 0/1
        if (editingItem && (editingItem.is_active === 0 || editingItem.is_active === 1)) {
            return [
                { value: 0, label: '0 - Inactive (System)' },
                { value: 1, label: '1 - Active (System)' }
            ];
        }
        // Jika item User (2/3) atau item baru, opsi 2/3
        return [
            { value: 2, label: '2 - Inactive (User)' },
            { value: 3, label: '3 - Active (User)' }
        ];
    };

    // --- SUB-COMPONENT: RENDER SUBMENU ---
    const SubItemList = ({ items, depth = 1 }: { items: SidebarItem[], depth?: number }) => {
        return (
            <div className="flex flex-col w-full">
                {items.map(item => (
                    <div key={item.id} className="relative w-full">
                        <div 
                            className={`
                                flex items-center justify-between p-3 my-1 rounded-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm
                                ${!item.is_active ? 'opacity-50 grayscale' : ''}
                            `}
                            style={{ marginLeft: `${depth * 24}px` }} 
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-1.5 bg-gray-50 dark:bg-gray-700 rounded text-gray-500">
                                    <Icon icon={item.icon || 'lucide:circle'} className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="font-medium text-sm text-gray-700 dark:text-gray-200">{item.title}</span>
                                    <div className="flex gap-2 text-[10px] text-gray-400">
                                        {item.route && <span>route: {item.route}</span>}
                                        <span className={item.is_active % 2 !== 0 ? 'text-green-500' : 'text-red-500'}>
                                            status: {item.is_active}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex gap-1">
                                <button onClick={() => openModal(item)} className="p-1.5 hover:bg-blue-50 text-blue-600 rounded transition-colors">
                                    <Icon icon="lucide:edit-2" className="w-4 h-4" />
                                </button>
                                {/* Logic: is_active 0/1 tidak bisa dihapus */}
                                {![0, 1].includes(item.is_active) && (
                                    <button onClick={() => handleDelete(item.id)} className="p-1.5 hover:bg-red-50 text-red-600 rounded transition-colors">
                                        <Icon icon="lucide:trash-2" className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                        
                        {item.children && item.children.length > 0 && (
                            <SubItemList items={item.children} depth={depth + 1} />
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Sidebar Management" />

            <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* HEADER */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Sidebar Manager</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Customize layout, groups, and visibility of menu items.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsGroupModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                        >
                            <Icon icon="lucide:folder-plus" className="w-4 h-4" />
                            New Group
                        </button>
                        <button
                            onClick={saveOrder}
                            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                        >
                            <Icon icon="lucide:save" className="w-4 h-4" />
                            Save Order
                        </button>
                        <PrimaryButton 
                            onClick={() => openModal()}
                            style={{ backgroundColor: primaryColor }}
                            className="flex items-center gap-2"
                        >
                            <Icon icon="lucide:plus" className="w-4 h-4" />
                            Add Menu
                        </PrimaryButton>
                    </div>
                </div>

                {/* CONTENT: MODULE LIST */}
                <div className="space-y-8">
                    {modules.map((module, mIdx) => (
                        <div key={module.module_name} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-gray-50/50 dark:bg-gray-900/50 shadow-sm">
                            {/* MODULE HEADER (Fixed Parent) */}
                            <div className="bg-gray-200 dark:bg-gray-800 px-4 py-3 border-b border-gray-300 dark:border-gray-700 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Icon icon="lucide:package" className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                    <h2 className="font-bold text-gray-800 dark:text-gray-200 font-mono text-sm">{module.module_name}</h2>
                                </div>
                                <span className="text-[10px] px-2 py-0.5 bg-gray-300 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-400 uppercase tracking-wide">Module</span>
                            </div>

                            <div className="p-4 space-y-6">
                                {module.groups.map((group, gIdx) => (
                                    <div key={group.group_name} className="relative">
                                        {/* GROUP HEADER (Visual Separator with Full Width Line) */}
                                        <div className="flex items-center gap-4 mb-4">
                                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap pl-2">
                                                {group.group_name}
                                            </span>
                                            <div className="h-px bg-gray-300 dark:bg-gray-600 flex-1 opacity-70"></div>
                                            <button 
                                                onClick={() => openModal(null, group.group_name, module.module_name)}
                                                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity"
                                            >
                                                <Icon icon="lucide:plus" className="w-3 h-3" /> Add Item
                                            </button>
                                        </div>

                                        {/* DRAGGABLE ITEMS LIST */}
                                        <Reorder.Group 
                                            axis="y" 
                                            values={group.items} 
                                            onReorder={(newItems) => handleReorderGroup(mIdx, gIdx, newItems)}
                                            className="space-y-1 min-h-[10px]"
                                        >
                                            {group.items.map((item) => (
                                                <Reorder.Item key={item.id} value={item} id={String(item.id)}>
                                                    <div className={`
                                                        relative group flex items-center justify-between p-3 bg-white dark:bg-gray-800 
                                                        border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md 
                                                        transition-all cursor-grab active:cursor-grabbing ml-0 md:ml-4
                                                        ${(item.is_active === 0 || item.is_active === 2) ? 'border-l-4 border-l-red-400 opacity-75' : 'border-l-4 border-l-green-400'}
                                                    `}>
                                                        <div className="flex items-center gap-4 flex-1">
                                                            <Icon icon="lucide:grip-vertical" className="text-gray-300" />
                                                            
                                                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300`}>
                                                                <Icon icon={item.icon || 'lucide:circle'} className="w-5 h-5" />
                                                            </div>

                                                            <div className="flex flex-col">
                                                                <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
                                                                    {item.title}
                                                                </span>
                                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                                    {item.route ? <code className="bg-gray-100 dark:bg-gray-900 px-1 py-0.5 rounded">{item.route}</code> : <span>-</span>}
                                                                    {item.permission_name && (
                                                                        <span className="flex items-center gap-0.5 text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-1 py-0.5 rounded">
                                                                            <Icon icon="lucide:lock" className="w-3 h-3" />
                                                                            {item.permission_name}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button 
                                                                onClick={() => openModal(item, group.group_name, module.module_name)} 
                                                                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                                                title="Edit"
                                                            >
                                                                <Icon icon="lucide:edit" className="w-4 h-4" />
                                                            </button>
                                                            {![0, 1].includes(item.is_active) && (
                                                                <button 
                                                                    onClick={() => handleDelete(item.id)} 
                                                                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                                                    title="Delete"
                                                                >
                                                                    <Icon icon="lucide:trash" className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Sub Items (Non-Draggable) */}
                                                    {item.children && item.children.length > 0 && (
                                                        <div className="mt-2 mb-3 ml-4 md:ml-8 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                                                            <SubItemList items={item.children} />
                                                        </div>
                                                    )}
                                                </Reorder.Item>
                                            ))}
                                        </Reorder.Group>
                                        
                                        {group.items.length === 0 && (
                                            <div className="ml-4 py-3 text-center border border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-gray-400 text-sm">
                                                No items in this group
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* MODAL: CREATE / EDIT MENU */}
                <Modal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)}
                    title={editingItem ? 'Edit Menu Item' : 'New Menu Item'}
                >
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <InputLabel value="Title" />
                                <TextInput 
                                    value={data.title} 
                                    onChange={e => setData('title', e.target.value)} 
                                    className="w-full mt-1" 
                                    placeholder="Menu Title"
                                />
                                <InputError message={errors.title} />
                            </div>
                            <div>
                                <InputLabel value="Icon (Iconify)" />
                                <div className="relative">
                                    <TextInput 
                                        value={data.icon} 
                                        onChange={e => setData('icon', e.target.value)} 
                                        className="w-full mt-1 pl-10" 
                                        placeholder="lucide:home"
                                    />
                                    <div className="absolute top-1/2 left-3 transform -translate-y-1/2 pt-1 text-gray-400">
                                        <Icon icon={data.icon || 'lucide:search'} className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <InputLabel value="Route (e.g. admin.dashboard)" />
                                <TextInput 
                                    value={data.route} 
                                    onChange={e => setData('route', e.target.value)} 
                                    className="w-full mt-1" 
                                    placeholder="Route Name"
                                />
                            </div>
                            <div>
                                <InputLabel value="URL (Optional)" />
                                <TextInput 
                                    value={data.url} 
                                    onChange={e => setData('url', e.target.value)} 
                                    className="w-full mt-1" 
                                    placeholder="/path/to/url"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <InputLabel value="Group" />
                                <select 
                                    value={data.group} 
                                    onChange={e => setData('group', e.target.value)}
                                    className="w-full mt-1 border-gray-300 dark:border-gray-700 dark:bg-gray-900 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    {existing_groups.map(g => <option key={g} value={g}>{g}</option>)}
                                    {tempGroups.map(g => <option key={g} value={g}>{g} (New)</option>)}
                                </select>
                            </div>
                            <div>
                                <InputLabel value="Parent Menu" />
                                <select 
                                    value={data.parent_id} 
                                    onChange={e => setData('parent_id', e.target.value)}
                                    className="w-full mt-1 border-gray-300 dark:border-gray-700 dark:bg-gray-900 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="">No Parent (Root)</option>
                                    {parents.filter(p => p.id !== editingItem?.id).map(p => (
                                        <option key={p.id} value={p.id}>{p.title}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <InputLabel value="Permission Required" />
                                <select 
                                    value={data.permission_name} 
                                    onChange={e => setData('permission_name', e.target.value)}
                                    className="w-full mt-1 border-gray-300 dark:border-gray-700 dark:bg-gray-900 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="">No Permission</option>
                                    {permissions.map(p => (
                                        <option key={p.name} value={p.name}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <InputLabel value="Active Status" />
                                <select 
                                    value={data.is_active} 
                                    onChange={e => setData('is_active', parseInt(e.target.value))}
                                    className="w-full mt-1 border-gray-300 dark:border-gray-700 dark:bg-gray-900 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    {getStatusOptions().map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                                <p className="text-[10px] text-gray-500 mt-1">
                                    0/1: System Protected. 2/3: Deletable.
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end mt-6 gap-3">
                            <button 
                                type="button" 
                                onClick={() => setIsModalOpen(false)} 
                                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <PrimaryButton disabled={processing} style={{ backgroundColor: primaryColor }}>
                                {editingItem ? 'Update Menu' : 'Create Menu'}
                            </PrimaryButton>
                        </div>
                    </form>
                </Modal>

                {/* MODAL: NEW GROUP */}
                <Modal 
                    isOpen={isGroupModalOpen} 
                    onClose={() => setIsGroupModalOpen(false)}
                    title="Create New Group"
                    maxWidth="max-w-sm"
                >
                    <div>
                        <InputLabel value="Group Name" />
                        <TextInput 
                            value={newGroupName}
                            onChange={e => setNewGroupName(e.target.value)}
                            className="w-full mt-1"
                            placeholder="e.g. Analytics"
                            autoFocus
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            This group will be created locally. It will be saved to database once you add a menu item to it.
                        </p>
                        <div className="flex justify-end mt-6 gap-3">
                            <button 
                                onClick={() => setIsGroupModalOpen(false)} 
                                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <PrimaryButton onClick={handleCreateGroup} style={{ backgroundColor: primaryColor }}>
                                Create Group
                            </PrimaryButton>
                        </div>
                    </div>
                </Modal>

            </div>
        </AuthenticatedLayout>
    );
}