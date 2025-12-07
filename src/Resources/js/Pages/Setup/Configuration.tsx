import { useState, useMemo, useEffect } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import FaPublicLayout from '../../Layouts/FaPublicLayout';
import DynamicSettingInput from '../../Components/Settings/DynamicSettingInput';
import PrimaryButton from '../../Components/PrimaryButton';
import InstallationArtwork from './InstallationArtwork';
import FlashMessage, { FlashType } from '../../Components/Message/FlashMessage';
import { safeRoute } from '../../Utils/routeHelper';

// Interface untuk data Modul dari database (FuturismeModule)
interface ModuleItem {
    id: number;
    name: string;
    plugin: string; // matches by_module
    version: string;
    description?: string;
    is_active?: boolean;
}

interface SettingItem {
    id: number;
    key: string;
    title: string;
    value: any;
    type: string;
    form_type: string;
    group: string;
    by_module: string;
    option?: any[] | null;
    is_active?: number;
    add_by?: string;
}

interface Props {
    settings: SettingItem[];
    modules?: ModuleItem[]; // Prop baru untuk data modul
}

export default function Configuration({ settings = [], modules = [] }: Props) {
    // Hooks Inertia
    const { flash, errors: pageErrors } = usePage<any>().props;

    // Helper inline pengganti textFormatter
    const formatLabel = (str: string) => str.replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const getModuleName = (key: string) => key.split('/')[1] || key;

    // --- STATES ---
    const [isMenuLoading, setIsMenuLoading] = useState(true);
    const [flashMsg, setFlashMsg] = useState<{ msg: string | null, type: FlashType }>({ msg: null, type: 'success' });

    // Grouping Logic
    const { groupedSettings, moduleOrder, groupOrder } = useMemo(() => {
        const groups: Record<string, Record<string, SettingItem[]>> = {};
        const modOrder: string[] = [];
        const grpOrder: Record<string, string[]> = {};
        
        settings.forEach(item => {
            const moduleName = item.by_module || 'System Core';
            const groupName = item.group || 'General';

            if (!groups[moduleName]) {
                groups[moduleName] = {};
                modOrder.push(moduleName);
                grpOrder[moduleName] = [];
            }
            if (!groups[moduleName][groupName]) {
                groups[moduleName][groupName] = [];
                grpOrder[moduleName].push(groupName);
            }
            groups[moduleName][groupName].push(item);
        });

        return { groupedSettings: groups, moduleOrder: modOrder, groupOrder: grpOrder };
    }, [settings]);

    const [activeTab, setActiveTab] = useState(moduleOrder[0] || 'System Core');

    // --- EFFECTS ---

    // 1. Simulate Menu Skeleton Loading (2 seconds)
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsMenuLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    // 2. Handle Flash Messages & Errors
    useEffect(() => {
        if (flash?.success) {
            setFlashMsg({ msg: flash.success, type: 'success' });
        } else if (flash?.error) {
            setFlashMsg({ msg: flash.error, type: 'error' });
        } else if (Object.keys(pageErrors).length > 0) {
            // Ambil error pertama jika ada multiple error validasi
            const firstError = Object.values(pageErrors)[0];
            setFlashMsg({ msg: firstError as string, type: 'error' });
        }
    }, [flash, pageErrors]);

    // Mendapatkan Info Modul Aktif (dari DB atau Fallback)
    const activeModuleInfo = useMemo(() => {
        const dbModule = modules.find(m => m.plugin === activeTab);
        if (dbModule) return dbModule;

        // Fallback jika data modul tidak dikirim dari controller
        return {
            name: formatLabel(getModuleName(activeTab)),
            plugin: activeTab,
            version: '1.0.0', // Default version
            description: 'Core system configuration module.'
        };
    }, [activeTab, modules]);

    const initialFormValues = settings.reduce((acc, item) => {
        if (['file', 'image'].includes(item.form_type)) {
            acc[item.key] = item.value; 
        } else if (['boolean', 'toggle', 'checkbox'].includes(item.type) || ['toggle', 'checkbox'].includes(item.form_type)) {
            acc[item.key] = item.value === 'true' || item.value === '1' || item.value === 1 || item.value === true;
        } else {
            acc[item.key] = item.value || '';
        }
        return acc;
    }, {} as Record<string, any>);

    const { data, setData, post, processing, errors } = useForm(initialFormValues);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(safeRoute('futurisme.setup.config.store', '/fu-settings/save'), {
            forceFormData: true,
            preserveScroll: true,
            onError: (err) => {
                console.error("Submission error:", err);
                setFlashMsg({ msg: "Failed to save configuration. Please check the form.", type: 'error' });
            }
        });
    };

    return (
        <FaPublicLayout title="Configuration Wizard" maxWidth="max-w-full">
            {/* Flash Message Component */}
            <FlashMessage 
                message={flashMsg.msg} 
                type={flashMsg.type} 
                onClose={() => setFlashMsg({ ...flashMsg, msg: null })} 
            />

            {/* Main Container: h-screen & overflow-hidden penting untuk mencegah scrollbar ganda */}
            <div className="flex flex-col lg:flex-row h-screen bg-white dark:bg-slate-900 overflow-hidden fixed inset-0">
                
                {/* Left Panel: Artwork */}
                <div className="hidden lg:block lg:w-5/12 xl:w-1/3 relative bg-slate-900 h-full border-r border-slate-800">
                    <div className="h-full w-full relative z-10">
                        <InstallationArtwork />
                    </div>
                </div>

                {/* Right Panel: Content */}
                <div className="w-full lg:w-7/12 xl:w-2/3 flex flex-col h-full bg-slate-50 dark:bg-slate-950 relative">
                    
                    {/* Header: Fixed */}
                    <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-30 shadow-sm flex justify-between items-center shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-600 dark:text-indigo-400">
                                <Icon icon="solar:settings-minimalistic-bold-duotone" width="24" height="24" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">
                                    System Configuration
                                </h1>
                                <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                                    Setup your environment variables & settings.
                                </p>
                            </div>
                        </div>
                        <div className="hidden md:block text-right">
                             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">System Active</span>
                             </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden relative">
                        
                        {/* Sidebar: Navigation List */}
                        <div className="w-full md:w-60 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shrink-0 h-full overflow-y-auto custom-scrollbar">
                            <div className="p-3">
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-2 mt-2">
                                    INSTALLED MODULES
                                </h3>
                                <div className="space-y-1">
                                    {isMenuLoading ? (
                                        // Skeleton Animation
                                        Array.from({ length: 5 }).map((_, i) => (
                                            <div key={i} className="px-3 py-2.5 rounded-md flex items-center gap-3 animate-pulse">
                                                <div className="w-4 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
                                                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                                            </div>
                                        ))
                                    ) : (
                                        // Actual Menu Items
                                        moduleOrder.map((module) => {
                                            const isActive = activeTab === module;
                                            return (
                                                <button
                                                    key={module}
                                                    type="button"
                                                    onClick={() => setActiveTab(module)}
                                                    className={`
                                                        w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-3 group relative
                                                        ${isActive 
                                                            ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' 
                                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}
                                                    `}
                                                >
                                                    {isActive && (
                                                        <motion.div layoutId="activeTabIndicator" className="absolute left-0 w-1 h-5 bg-indigo-500 rounded-r-full" />
                                                    )}
                                                    <Icon 
                                                        icon={module.includes('admin') ? 'solar:shield-user-bold' : 'solar:box-minimalistic-bold'} 
                                                        className={isActive ? 'text-indigo-500' : 'text-slate-400 group-hover:text-slate-500'}
                                                        width="16" 
                                                    />
                                                    <span className="truncate flex-1 text-xs font-semibold">{formatLabel(getModuleName(module))}</span>
                                                </button>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Content: Form Inputs */}
                        {/* UPDATED: Increased pb to pb-60 to ensure footer never covers content */}
                        <div className="flex-1 h-full overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-slate-950 p-4 md:p-8 pb-60">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.25, ease: "easeOut" }}
                                >
                                    {/* Module Header Info */}
                                    <div className="mb-6 bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                                                <Icon icon="solar:cube-bold-duotone" width="20" />
                                            </div>
                                            <div>
                                                <h2 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                                    {activeModuleInfo.name}
                                                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 uppercase">
                                                        v{activeModuleInfo.version}
                                                    </span>
                                                </h2>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <code className="text-[10px] text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-1.5 py-0.5 rounded font-mono">
                                                        {activeModuleInfo.plugin}
                                                    </code>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Settings Groups */}
                                    <div className="space-y-6 pb-14">
                                        {groupedSettings[activeTab] && groupOrder[activeTab].map((groupName, idx) => (
                                            <motion.div 
                                                key={groupName}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 md:p-6 shadow-sm"
                                            >
                                                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-3">
                                                    <span className="w-6 h-[2px] bg-indigo-500 rounded-full"></span>
                                                    {groupName.replace('_', ' ')}
                                                </h3>

                                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-8 gap-y-6">
                                                    {groupedSettings[activeTab][groupName].map((setting) => (
                                                        <div key={setting.id} className={['textarea', 'toggle', 'radio'].includes(setting.form_type) ? 'xl:col-span-2' : ''}>
                                                            <DynamicSettingInput 
                                                                setting={setting}
                                                                value={data[setting.key]}
                                                                onChange={(val) => setData(setting.key, val)}
                                                                error={errors[setting.key]}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </form>

                    {/* Footer Actions */}
                    <div className="absolute bottom-0 left-0 w-full bg-white/80 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-4 md:px-6 z-40">
                        <div className="flex flex-col sm:flex-row justify-between items-center max-w-full gap-4">
                            <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400">
                                <Icon icon="solar:info-circle-bold" className="text-indigo-500" />
                                <span>Changes are written to local .env and database immediately.</span>
                            </div>
                            <div className="flex gap-3 w-full sm:w-auto justify-end">
                                <PrimaryButton 
                                    onClick={handleSubmit}
                                    disabled={processing} 
                                    className="w-full sm:w-auto px-6 py-2 text-sm shadow-lg shadow-indigo-500/20 justify-center rounded-lg"
                                >
                                    {processing ? (
                                        <div className="flex items-center gap-2">
                                            <Icon icon="svg-spinners:ring-resize" /> Processing...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Icon icon="solar:disk-bold-duotone" /> Save Configuration
                                        </div>
                                    )}
                                </PrimaryButton>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </FaPublicLayout>
    );
}