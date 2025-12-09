import { useState, CSSProperties } from 'react';
import { Head, usePage, router, useForm } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';

// Layouts & Components
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import PrimaryButton from '../../Components/PrimaryButton';
import TextInput from '../../Components/TextInput';
import InputLabel from '../../Components/InputLabel';
import InputError from '../../Components/InputError';
import Modal from '../../Components/UI/Modal';
import { safeRoute } from '../../Utils/routeHelper';

// Types
interface Role {
    id: number;
    name: string;
    guard_name: string;
    permissions_count?: number;
    created_at: string;
}

interface Permission {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
}

interface PageProps {
    roles: { data: Role[]; links: any[] };
    permissions: { data: Permission[]; links: any[] };
    filters: { search: string };
    config: any;
}

export default function RolesIndex({ roles, permissions, filters }: PageProps) {
    const { config } = usePage().props as any;
    const urlPrefix = config?.admin_url_prefix || 'admin';
    const rawPrimaryColor = config?.theme?.color_primary;
    const primaryColor = (rawPrimaryColor === 'default' || !rawPrimaryColor) ? '#4f46e5' : rawPrimaryColor;

    // State
    const [activeTab, setActiveTab] = useState<'roles' | 'permissions'>('roles');
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [editingItem, setEditingItem] = useState<Role | Permission | null>(null);

    // Form Handling
    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        name: '',
        guard_name: 'web',
    });

    // --- ACTIONS ---

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // PERBAIKAN: Tambahkan fallback URL sebagai argumen kedua
        router.get(safeRoute('futurisme.roles.index', `/${urlPrefix}/roles`), { search: searchTerm }, { preserveState: true });
    };

    const openCreateModal = () => {
        setModalMode('create');
        setEditingItem(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (item: Role | Permission) => {
        setModalMode('edit');
        setEditingItem(item);
        setData({
            name: item.name,
            guard_name: item.guard_name,
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const isRole = activeTab === 'roles';
        
        if (modalMode === 'create') {
            const routeName = isRole ? 'futurisme.roles.store' : 'futurisme.permissions.store';
            const url = isRole ? `/${urlPrefix}/roles` : `/${urlPrefix}/permissions/store`; 
            
            post(safeRoute(routeName, url), {
                onSuccess: () => setIsModalOpen(false),
            });
        } else {
            const routeName = isRole ? 'futurisme.roles.update' : 'futurisme.permissions.update';
            const url = isRole ? `/${urlPrefix}/roles/${editingItem?.id}` : `/${urlPrefix}/permissions/${editingItem?.id}/update`;
            
            put(safeRoute(routeName, url), {
                onSuccess: () => setIsModalOpen(false),
            });
        }
    };

    const handleDelete = (id: number) => {
        if (!confirm('Are you sure you want to delete this item?')) return;

        const isRole = activeTab === 'roles';
        const routeName = isRole ? 'futurisme.roles.destroy' : 'futurisme.permissions.destroy';
        const url = isRole ? `/${urlPrefix}/roles/${id}` : `/${urlPrefix}/permissions/${id}/destroy`;

        destroy(safeRoute(routeName, url), { preserveScroll: true });
    };

    // Styling
    const tabActiveStyle: CSSProperties = {
        color: primaryColor,
        borderColor: primaryColor,
    };

    return (
        <AuthenticatedLayout header="Role & Permission Management">
            <Head title="Roles & Permissions" />

            <div className="space-y-6">
                {/* --- HEADER CONTROLS --- */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50">
                    
                    {/* Tabs */}
                    <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-900 p-1 rounded-xl">
                        <button
                            onClick={() => setActiveTab('roles')}
                            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${activeTab === 'roles' ? 'bg-white dark:bg-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                            style={activeTab === 'roles' ? { color: primaryColor } : {}}
                        >
                            Roles
                        </button>
                        <button
                            onClick={() => setActiveTab('permissions')}
                            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${activeTab === 'permissions' ? 'bg-white dark:bg-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                            style={activeTab === 'permissions' ? { color: primaryColor } : {}}
                        >
                            Permissions
                        </button>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <form onSubmit={handleSearch} className="relative flex-1 md:flex-none">
                            <Icon icon="solar:magnifer-linear" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="20" />
                            <input 
                                type="text"
                                placeholder={`Search ${activeTab}...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full md:w-64 pl-10 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-opacity-20 transition-all outline-none"
                                style={{ '--tw-ring-color': primaryColor } as CSSProperties}
                            />
                        </form>
                        
                        <PrimaryButton 
                            onClick={openCreateModal}
                            className="py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                            style={{ backgroundColor: primaryColor }}
                        >
                            <Icon icon="solar:add-circle-bold" width="20" />
                            <span className="hidden sm:inline">Add New</span>
                        </PrimaryButton>
                    </div>
                </div>

                {/* --- DATA TABLE --- */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="bg-gray-50/50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
                                    <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">#</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Name</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Guard</th>
                                    {activeTab === 'roles' && (
                                        <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300 text-center">Permissions</th>
                                    )}
                                    <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Created At</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                                {(activeTab === 'roles' ? roles.data : permissions.data).map((item, index) => (
                                    <motion.tr 
                                        key={item.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                                    >
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400 w-12">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                {item.name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                                                {item.guard_name}
                                            </span>
                                        </td>
                                        {activeTab === 'roles' && (
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
                                                    {(item as Role).permissions_count || 0}
                                                </span>
                                            </td>
                                        )}
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => openEditModal(item)}
                                                    className="p-2 rounded-lg text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                                                    title="Edit"
                                                >
                                                    <Icon icon="solar:pen-new-square-linear" width="18" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Icon icon="solar:trash-bin-trash-linear" width="18" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}

                                {(activeTab === 'roles' ? roles.data : permissions.data).length === 0 && (
                                    <tr>
                                        <td colSpan={activeTab === 'roles' ? 6 : 5} className="px-6 py-12 text-center text-gray-400 dark:text-gray-500">
                                            <div className="flex flex-col items-center gap-3">
                                                <Icon icon="solar:box-minimalistic-linear" width="48" className="opacity-50" />
                                                <p>No {activeTab} found</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Pagination (Simple) */}
                    <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                        {/* Implementasikan komponen pagination di sini jika link tersedia */}
                        <div className="text-xs text-gray-500 text-center">
                            Showing data {activeTab} page 1
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MODAL FORM --- */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={`${modalMode === 'create' ? 'Create New' : 'Edit'} ${activeTab === 'roles' ? 'Role' : 'Permission'}`}
            >
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <InputLabel htmlFor="name" value="Name" />
                        <TextInput
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="mt-1 block w-full"
                            placeholder={activeTab === 'roles' ? 'e.g. Super Admin' : 'e.g. edit_posts'}
                            isFocused
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="guard_name" value="Guard Name" />
                        <TextInput
                            id="guard_name"
                            type="text"
                            value={data.guard_name}
                            onChange={(e) => setData('guard_name', e.target.value)}
                            className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                            readOnly
                        />
                        <p className="text-xs text-gray-400 mt-1">Default guard is 'web'.</p>
                        <InputError message={errors.guard_name} className="mt-2" />
                    </div>

                    <div className="flex justify-end pt-4 gap-3">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <PrimaryButton 
                            className="px-6 py-2 rounded-xl shadow-lg"
                            style={{ backgroundColor: primaryColor }}
                            disabled={processing}
                        >
                            {processing ? 'Saving...' : 'Save Changes'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}