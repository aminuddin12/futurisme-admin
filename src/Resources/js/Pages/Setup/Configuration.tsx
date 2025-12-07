import { useState, useMemo } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import FaPublicLayout from '../../Layouts/FaPublicLayout';
import DynamicSettingInput from '../../Components/Settings/DynamicSettingInput';
import PrimaryButton from '../../Components/PrimaryButton';
import InstallationArtwork from './InstallationArtwork';
import { formatModuleName } from '../../Utils/textFormatter';
import { safeRoute } from '../../Utils/routeHelper';

interface SettingItem {
    id: number;
    key: string;
    value: any;
    type: string;
    form_type: string;
    group: string;
    by_module: string;
}

interface Props {
    settings: SettingItem[];
}

export default function Configuration({ settings = [] }: Props) {
    // 1. Grouping Data
    const groupedSettings = useMemo(() => {
        const groups: Record<string, Record<string, SettingItem[]>> = {};
        
        settings.forEach(item => {
            const moduleName = item.by_module || 'System Core';
            const groupName = item.group || 'General';

            if (!groups[moduleName]) groups[moduleName] = {};
            if (!groups[moduleName][groupName]) groups[moduleName][groupName] = [];

            groups[moduleName][groupName].push(item);
        });

        return groups;
    }, [settings]);

    const modules = Object.keys(groupedSettings);
    const [activeTab, setActiveTab] = useState(modules[0]);

    const initialFormValues = settings.reduce((acc, item) => {
        if (item.form_type === 'file' || item.form_type === 'image') {
            acc[item.key] = item.value; 
        } else if (item.type === 'boolean' || item.form_type === 'toggle' || item.form_type === 'checkbox') {
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
            onSuccess: () => {
                // Optional success feedback
            },
            onError: (err) => {
                console.error("Submission error:", err);
            }
        });
    };

    const handleSettingChange = (key: string, val: any) => {
        setData(key, val);
    };

    return (
        <FaPublicLayout title="System Configuration" maxWidth="w-full h-screen p-0 max-w-full">
            
            <div className="flex flex-col lg:flex-row min-h-screen h-screen bg-white dark:bg-slate-900 overflow-hidden">
                
                {/* LEFT COLUMN: ARTWORK (40% width) */}
                <div className="hidden lg:block lg:w-2/5 h-full relative overflow-hidden">
                    <div className="absolute inset-0">
                        <InstallationArtwork />
                    </div>
                </div>

                {/* RIGHT COLUMN: FORM & CONTENT (60% width) */}
                <div className="w-full lg:w-3/5 h-full flex flex-col bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800">
                    
                    {/* Header Section */}
                    <div className="px-8 py-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 z-20">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
                                <Icon icon="solar:settings-bold-duotone" width="32" height="32" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                                    Configuration Wizard
                                </h1>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                                    Configure your ecosystem modules to get started.
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
                        <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
                            
                            {/* Inner Sidebar: Module Tabs */}
                            <div className="w-full md:w-64 bg-slate-50 dark:bg-slate-900/50 border-r border-slate-200 dark:border-slate-800 p-4 overflow-y-auto shrink-0">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-3">
                                    Available Modules
                                </h3>
                                <div className="space-y-1">
                                    {modules.map((module) => (
                                        <button
                                            key={module}
                                            type="button"
                                            onClick={() => setActiveTab(module)}
                                            className={`
                                                w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-3
                                                ${activeTab === module 
                                                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700' 
                                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'}
                                            `}
                                        >
                                            <Icon 
                                                icon={module.includes('admin') ? 'solar:shield-user-bold' : 'solar:box-bold'} 
                                                className={activeTab === module ? 'text-indigo-500' : 'text-slate-400'}
                                                width="18" 
                                            />
                                            <span className="truncate">{formatModuleName(module)}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Content Area (Scrollable) */}
                            <div className="flex-1 relative h-full overflow-y-auto custom-scrollbar bg-white dark:bg-slate-900">
                                <div className="p-6 md:p-8 pb-24">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={activeTab}
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <div className="mb-8">
                                                <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                                    {formatModuleName(activeTab)}
                                                    <span className="text-sm font-normal text-slate-400 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                                        v1.0.0
                                                    </span>
                                                </h2>
                                                <div className="h-1 w-12 bg-indigo-500 mt-2 rounded-full"></div>
                                            </div>

                                            <div className="space-y-10">
                                                {Object.entries(groupedSettings[activeTab]).map(([groupName, groupSettings]) => (
                                                    <div key={groupName} className="relative group-section">
                                                        
                                                        <div className="sticky top-0 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm py-3 mb-4 border-b border-slate-100 dark:border-slate-800 -mx-6 md:-mx-8 px-6 md:px-8 shadow-sm">
                                                            <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                                                                <Icon icon="solar:menu-dots-bold" />
                                                                {groupName.replace('_', ' ')}
                                                            </h3>
                                                        </div>

                                                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-6 gap-y-6">
                                                            {groupSettings.map((setting) => (
                                                                <div key={setting.id} className={setting.form_type === 'textarea' || setting.form_type === 'toggle' ? 'xl:col-span-2' : ''}>
                                                                    <DynamicSettingInput 
                                                                        setting={setting}
                                                                        value={data[setting.key]}
                                                                        onChange={(val) => handleSettingChange(setting.key, val)}
                                                                        error={errors[setting.key]}
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="px-8 py-5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0 z-20">
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <Icon icon="heroicons:information-circle" className="text-indigo-400" />
                                <span className="hidden sm:inline">Changes will be applied immediately.</span>
                            </div>
                            
                            <div className="w-full sm:w-auto flex gap-3">
                                <PrimaryButton disabled={processing} className="w-full sm:w-auto px-8 py-3 text-base shadow-xl shadow-indigo-500/20 justify-center">
                                    {processing ? (
                                        <div className="flex items-center gap-2">
                                            <Icon icon="eos-icons:loading" className="animate-spin" /> Saving...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Icon icon="solar:disk-bold" /> Save & Continue
                                        </div>
                                    )}
                                </PrimaryButton>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </FaPublicLayout>
    );
}