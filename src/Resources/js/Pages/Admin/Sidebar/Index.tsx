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

interface SidebarItem {
    id: number | string;
    title: string;
    url?: string;
    route?: string;
    icon?: string;
    parent_id?: number | null;
    order: number;
    permission_name?: string;
    is_active: number;
    group: string;
    by_module: string;
    type?: 'item' | 'divider';
    group_name?: string;
    depth?: number;
}

interface ModuleData {
    module_name: string;
    items: SidebarItem[];
}

interface PageProps {
    modules_data: ModuleData[];
    parents: { id: number; title: string }[];
    permissions: { name: string }[];
    existing_groups: string[];
    config: any;
}

const SkeletonLoader = () => (
    <div className="w-full space-y-4 p-4">
        <div className="flex gap-4">
            <div className="w-1/4 space-y-3">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                ))}
            </div>
            <div className="w-3/4 space-y-6">
                <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
                <div className="space-y-3">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const ModuleEditor = ({ 
    moduleData, 
    onAddGroup, 
    onAddItem, 
    onEditItem, 
    onDelete, 
    primaryColor 
}: { 
    moduleData: ModuleData, 
    onAddGroup: () => void,
    onAddItem: (group: string, module: string) => void,
    onEditItem: (item: SidebarItem) => void,
    onDelete: (id: number) => void,
    primaryColor: string
}) => {
    const prepareList = (items: SidebarItem[]) => {
        const grouped = items.reduce((acc, item) => {
            const g = item.group || 'general';
            if (!acc[g]) acc[g] = [];
            acc[g].push(item);
            return acc;
        }, {} as Record<string, SidebarItem[]>);

        let flatList: SidebarItem[] = [];
        const groups = Object.keys(grouped).sort((a, b) => a === 'general' ? -1 : 1);

        groups.forEach(g => {
            flatList.push({
                id: `divider-${g}-${moduleData.module_name}`,
                type: 'divider',
                group_name: g,
                title: g,
                is_active: 1,
                order: -1,
                group: g,
                by_module: moduleData.module_name
            } as SidebarItem);

            const addItems = (list: SidebarItem[], parentId: number | null = null, depth = 0) => {
                const rootItems = list.filter(i => i.parent_id === parentId).sort((a,b) => a.order - b.order);
                rootItems.forEach(item => {
                    flatList.push({ ...item, depth });
                    addItems(list, Number(item.id), depth + 1);
                });
            };

            addItems(grouped[g]);
        });

        return flatList;
    };

    const [items, setItems] = useState<SidebarItem[]>(prepareList(moduleData.items));
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        setItems(prepareList(moduleData.items));
        setIsDirty(false);
    }, [moduleData]);

    const handleReorder = (newOrder: SidebarItem[]) => {
        setItems(newOrder);
        setIsDirty(true);
    };

    const handleSave = () => {
        router.post(route('futurisme.sidebar.reorder'), {
            items: items.map(i => ({
                id: i.type === 'divider' ? null : i.id,
                type: i.type,
                group_name: i.group_name,
                parent_id: i.parent_id
            })),
            module_name: moduleData.module_name
        }, {
            preserveScroll: true,
            onSuccess: () => setIsDirty(false)
        });
    };

    const changeDepth = (index: number, change: number) => {
        const newItems = [...items];
        const item = newItems[index];
        const prevItem = newItems[index - 1];

        if (item.type === 'divider' || !prevItem || prevItem.type === 'divider') return;

        if (change > 0) {
            if ((item.depth || 0) <= (prevItem.depth || 0)) {
                item.depth = (item.depth || 0) + 1;
                item.parent_id = Number(prevItem.id);
            }
        } else {
            if ((item.depth || 0) > 0) {
                item.depth = (item.depth || 0) - 1;
                if (item.depth === 0) item.parent_id = null;
                else {
                    for (let i = index - 1; i >= 0; i--) {
                        if ((newItems[i].depth || 0) === item.depth! - 1) {
                            item.parent_id = Number(newItems[i].id);
                            break;
                        }
                    }
                }
            }
        }
        setItems(newItems);
        setIsDirty(true);
    };

    return (
        <div id={`module-${moduleData.module_name}`} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm mb-8 scroll-mt-24">
            <div className="sticky top-0 z-20 bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between backdrop-blur-md bg-opacity-90 dark:bg-opacity-90">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
                        <Icon icon="lucide:package" className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                        <h2 className="font-bold text-gray-800 dark:text-gray-200 text-sm tracking-tight">{moduleData.module_name}</h2>
                        <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Module Config</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={onAddGroup}
                        className="p-2 text-xs font-medium bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                        title="Add Group"
                    >
                        <Icon icon="lucide:folder-plus" className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => onAddItem('general', moduleData.module_name)}
                        className="p-2 text-xs font-medium bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                        title="Add Menu"
                    >
                        <Icon icon="lucide:plus" className="w-4 h-4" />
                    </button>
                    <AnimatePresence>
                        {isDirty && (
                            <motion.button 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                onClick={handleSave}
                                style={{ backgroundColor: primaryColor }}
                                className="flex items-center gap-1 px-4 py-2 text-white text-xs font-bold rounded-lg shadow-md hover:opacity-90 transition-all"
                            >
                                <Icon icon="lucide:save" className="w-3 h-3" /> Save Changes
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="p-4 bg-gray-50/30 dark:bg-gray-900/30 min-h-[100px]">
                <Reorder.Group axis="y" values={items} onReorder={handleReorder} className="space-y-1">
                    {items.map((item, idx) => (
                        <Reorder.Item key={item.id} value={item} id={String(item.id)} dragListener={item.type !== 'divider'}>
                            {item.type === 'divider' ? (
                                <div className="mt-6 mb-3 flex items-center gap-4 select-none group">
                                    <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700">
                                        <Icon icon="lucide:layers" className="w-3 h-3 text-gray-500" />
                                        <span className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">{item.title}</span>
                                    </div>
                                    <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1"></div>
                                    <button 
                                        onClick={() => onAddItem(item.group_name!, moduleData.module_name)}
                                        className="text-[10px] opacity-0 group-hover:opacity-100 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 px-3 py-1 rounded-full text-gray-500 hover:text-indigo-600 hover:border-indigo-300 transition-all shadow-sm"
                                    >
                                        + Add to {item.group_name}
                                    </button>
                                </div>
                            ) : (
                                <div 
                                    className={`
                                        relative group flex items-center p-3 
                                        bg-white dark:bg-gray-800 
                                        border border-gray-200 dark:border-gray-700 
                                        rounded-lg shadow-sm 
                                        transition-all duration-200 ease-in-out
                                        ${(item.is_active === 0 || item.is_active === 2) ? 'opacity-60 grayscale-[0.5]' : ''}
                                        hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md
                                    `}
                                    style={{ 
                                        marginLeft: `${(item.depth || 0) * 28}px`,
                                        width: `calc(100% - ${(item.depth || 0) * 28}px)`
                                    }}
                                >
                                    {(item.depth || 0) > 0 && (
                                        <div className="absolute -left-4 top-1/2 w-4 h-px bg-gray-300 dark:bg-gray-600"></div>
                                    )}
                                    {(item.depth || 0) > 0 && (
                                        <div className="absolute -left-4 top-0 bottom-1/2 w-px bg-gray-300 dark:bg-gray-600 -mt-5"></div>
                                    )}

                                    <div className="flex items-center gap-3 flex-1 overflow-hidden">
                                        <div className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 transition-colors">
                                            <Icon icon="lucide:grip-vertical" className="w-4 h-4" />
                                        </div>
                                        
                                        <div className={`
                                            shrink-0 w-8 h-8 rounded-lg flex items-center justify-center 
                                            ${(item.is_active === 0 || item.is_active === 2) ? 'bg-red-50 text-red-500' : 'bg-indigo-50 text-indigo-500'}
                                            dark:bg-gray-700 dark:text-gray-300
                                        `}>
                                            <Icon icon={item.icon || 'lucide:circle'} className="w-4 h-4" />
                                        </div>

                                        <div className="flex flex-col min-w-0">
                                            <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm truncate">
                                                {item.title}
                                            </span>
                                            <div className="flex items-center gap-2 text-[10px] text-gray-500">
                                                {item.route ? (
                                                    <span className="font-mono bg-gray-100 dark:bg-gray-900 px-1.5 py-0.5 rounded truncate max-w-[150px]">
                                                        {item.route}
                                                    </span>
                                                ) : (
                                                    <span>-</span>
                                                )}
                                                {item.permission_name && (
                                                    <span className="flex items-center gap-0.5 text-amber-600 dark:text-amber-500">
                                                        <Icon icon="lucide:lock" className="w-3 h-3" />
                                                        {item.permission_name}
                                                    </span>
                                                )}
                                                <span className={`px-1.5 py-0.5 rounded-full ${[1, 3, 4].includes(item.is_active) ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    S:{item.is_active}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pl-2">
                                        <button onClick={() => changeDepth(idx, -1)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 rounded-md transition-colors" title="Outdent">
                                            <Icon icon="lucide:chevron-left" className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => changeDepth(idx, 1)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 rounded-md transition-colors" title="Indent">
                                            <Icon icon="lucide:chevron-right" className="w-4 h-4" />
                                        </button>
                                        
                                        <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1"></div>

                                        <button onClick={() => onEditItem(item)} className="p-1.5 hover:bg-indigo-50 text-indigo-600 rounded-md transition-colors">
                                            <Icon icon="lucide:edit-2" className="w-4 h-4" />
                                        </button>
                                        {![0, 1].includes(item.is_active) && (
                                            <button onClick={() => onDelete(Number(item.id))} className="p-1.5 hover:bg-red-50 text-red-600 rounded-md transition-colors">
                                                <Icon icon="lucide:trash-2" className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </Reorder.Item>
                    ))}
                </Reorder.Group>
            </div>
        </div>
    );
};

export default function SidebarIndex({ modules_data, parents, permissions, existing_groups }: PageProps) {
    const { config } = usePage().props as any;
    const rawPrimaryColor = config?.theme?.color_primary;
    const primaryColor = (rawPrimaryColor === 'default' || !rawPrimaryColor) ? '#4f46e5' : rawPrimaryColor;

    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<SidebarItem | null>(null);
    const [newGroupName, setNewGroupName] = useState('');
    const [tempGroups, setTempGroups] = useState<string[]>([]);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        title: '',
        url: '',
        route: '',
        icon: '',
        parent_id: '',
        permission_name: '',
        is_active: 3,
        group: 'general',
        by_module: '',
        order: 0
    });

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    const openModal = (item: SidebarItem | null = null, groupName = 'general', moduleName = '') => {
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
            setData(prev => ({
                ...prev,
                group: groupName,
                by_module: moduleName,
                is_active: 3
            }));
        }
        setIsModalOpen(true);
    };

    const handleCreateGroup = () => {
        if (!newGroupName.trim()) return;
        setTempGroups([...tempGroups, newGroupName]);
        setIsGroupModalOpen(false);
        setNewGroupName('');
        reset();
        setData(prev => ({ ...prev, group: newGroupName }));
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingItem) {
            put(route('futurisme.sidebar.update', editingItem.id), { onSuccess: () => setIsModalOpen(false) });
        } else {
            post(route('futurisme.sidebar.store'), { onSuccess: () => setIsModalOpen(false) });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Delete this menu?')) destroy(route('futurisme.sidebar.destroy', id));
    };

    const scrollToModule = (moduleName: string) => {
        const element = document.getElementById(`module-${moduleName}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (isLoading) {
        return (
            <AuthenticatedLayout>
                <SkeletonLoader />
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout header="Sidebar Management">
            <Head title="Sidebar Management" />
            
            <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-gray-50/50 dark:bg-gray-900">
                <aside className="hidden lg:block w-64 h-full overflow-y-auto border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
                    <div className="mb-6">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Modules</h3>
                        <div className="space-y-1">
                            {modules_data.map((mod) => (
                                <button
                                    key={mod.module_name}
                                    onClick={() => scrollToModule(mod.module_name)}
                                    className="w-full text-left px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-colors truncate"
                                >
                                    {mod.module_name}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                <main className="flex-1 h-full overflow-y-auto p-4 lg:p-8 scroll-smooth">
                    <div className="max-w-5xl mx-auto">
                        <div className="mb-8 flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">Sidebar Manager</h1>
                                <p className="text-gray-500 mt-1 text-sm">Configure application menu structure and visibility.</p>
                            </div>
                        </div>

                        {modules_data.map((module) => (
                            <ModuleEditor
                                key={module.module_name}
                                moduleData={module}
                                primaryColor={primaryColor}
                                onAddGroup={() => setIsGroupModalOpen(true)}
                                onAddItem={(g, m) => openModal(null, g, m)}
                                onEditItem={(item) => openModal(item)}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                </main>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Menu' : 'New Menu'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel value="Title"/>
                            <TextInput value={data.title} onChange={e => setData('title', e.target.value)} className="w-full mt-1" placeholder="Menu Title" />
                            <InputError message={errors.title} />
                        </div>
                        <div>
                            <InputLabel value="Icon (Iconify)" />
                            <div className="relative">
                                <TextInput value={data.icon} onChange={e => setData('icon', e.target.value)} className="w-full mt-1 pl-9" placeholder="lucide:home" />
                                <div className="absolute top-[2.1rem] left-3 text-gray-400">
                                    <Icon icon={data.icon || 'lucide:search'} className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel value="Route Name" />
                            <TextInput value={data.route} onChange={e => setData('route', e.target.value)} className="w-full mt-1" placeholder="admin.dashboard" />
                        </div>
                        <div>
                            <InputLabel value="Direct URL" />
                            <TextInput value={data.url} onChange={e => setData('url', e.target.value)} className="w-full mt-1" placeholder="/custom/path" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel value="Group" />
                            <select value={data.group} onChange={e => setData('group', e.target.value)} className="w-full mt-1 border-gray-300 dark:border-gray-700 dark:bg-gray-900 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                                {existing_groups.map(g => <option key={g} value={g}>{g}</option>)}
                                {tempGroups.map(g => <option key={g} value={g}>{g} (New)</option>)}
                            </select>
                        </div>
                        <div>
                            <InputLabel value="Parent" />
                            <select value={data.parent_id} onChange={e => setData('parent_id', e.target.value)} className="w-full mt-1 border-gray-300 dark:border-gray-700 dark:bg-gray-900 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                                <option value="">No Parent (Root)</option>
                                {parents.filter(p => p.id !== editingItem?.id).map(p => (
                                    <option key={p.id} value={p.id}>{p.title}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel value="Permission" />
                            <select value={data.permission_name} onChange={e => setData('permission_name', e.target.value)} className="w-full mt-1 border-gray-300 dark:border-gray-700 dark:bg-gray-900 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                                <option value="">No Permission Required</option>
                                {permissions.map(p => (
                                    <option key={p.name} value={p.name}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <InputLabel value="Status" />
                            <select value={data.is_active} onChange={e => setData('is_active', parseInt(e.target.value))} className="w-full mt-1 border-gray-300 dark:border-gray-700 dark:bg-gray-900 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                                <option value="0">0 - Inactive (System Protected)</option>
                                <option value="1">1 - Active (System Protected)</option>
                                <option value="2">2 - Inactive (User)</option>
                                <option value="3">3 - Active (User)</option>
                                <option value="4">4 - Draft (User)</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800 mt-6">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            Cancel
                        </button>
                        <PrimaryButton disabled={processing} style={{ backgroundColor: primaryColor }} className="rounded-lg shadow-lg">
                            {editingItem ? 'Update Menu' : 'Create Menu'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            <Modal isOpen={isGroupModalOpen} onClose={() => setIsGroupModalOpen(false)} title="New Group" maxWidth="max-w-sm">
                <div>
                    <InputLabel value="Group Name" />
                    <TextInput value={newGroupName} onChange={e => setNewGroupName(e.target.value)} className="w-full mt-1" autoFocus placeholder="e.g. Analytics" />
                    <div className="flex justify-end gap-3 mt-6">
                        <button onClick={() => setIsGroupModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            Cancel
                        </button>
                        <PrimaryButton onClick={handleCreateGroup} style={{ backgroundColor: primaryColor }} className="rounded-lg shadow-lg">
                            Create Group
                        </PrimaryButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}