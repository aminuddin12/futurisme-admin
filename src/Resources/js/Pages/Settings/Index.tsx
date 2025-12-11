import { useState, ChangeEvent, CSSProperties } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Icon } from '@iconify/react';

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import Checkbox from '@/Components/Checkbox';
import { safeRoute } from '@/Utils/routeHelper';

// Interface sesuai data controller
interface SettingsProps {
    settings: {
        app_name: string;
        app_desc: string;
        app_env: string;
        app_debug: boolean;
        app_url: string;
        app_timezone: string;
        app_time_format: string;
        app_locale: string;
        app_fallback_locale: string;
        app_faker_locale: string;
        app_maintenance_driver: string;
        app_maintenance_store: string;

        system_logo_url: string | null;
        system_favicon_url: string | null;
        system_admin_url_prefix: string;
        system_backup_days: string;
        system_backup_month: string;
        system_max_file_upload: number;

        auth_admin_create_user: boolean;
        auth_public_register: boolean;
        auth_public_reset_password: boolean;
        auth_verify_account: boolean;
        auth_view_log: boolean;

        theme_auto_dark_mode: boolean;
        theme_color_primary: string;
        theme_color_secondary: string;
        theme_layout_mode: string;
        theme_profile_position: string;

        social_github: string;
        social_instagram: string;
    };
}

export default function SettingsIndex({ settings }: SettingsProps) {
    const { config } = usePage().props as any;
    const urlPrefix = config?.admin_url_prefix || 'admin';
    const primaryColor = settings.theme_color_primary || '#4f46e5';

    const { data, setData, post, processing, errors } = useForm({
        ...settings,
        logo: null as File | null,
        favicon: null as File | null,
        _method: 'PUT'
    });

    const [logoPreview, setLogoPreview] = useState<string | null>(settings.system_logo_url);
    const [faviconPreview, setFaviconPreview] = useState<string | null>(settings.system_favicon_url);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>, field: 'logo' | 'favicon') => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setData(field, file);
            if (field === 'logo') setLogoPreview(URL.createObjectURL(file));
            else setFaviconPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(safeRoute('futurisme.settings.update', `/${urlPrefix}/settings`), {
            preserveScroll: true,
        });
    };

    const sectionClass = "bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 mb-6";
    const headerClass = "flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700/50";
    const iconBoxClass = "p-2 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300";

    return (
        <AuthenticatedLayout header="System Configuration">
            <Head title="Settings" />

            <div className="max-w-5xl mx-auto pb-20">
                <form onSubmit={handleSubmit}>
                    
                    {/* 1. APP SETTINGS */}
                    <div className={sectionClass}>
                        <div className={headerClass}>
                            <div className={`${iconBoxClass} text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20`}>
                                <Icon icon="solar:smartphone-2-bold-duotone" width="24" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Application</h3>
                                <p className="text-sm text-gray-500">General application identity and environment.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <InputLabel value="App Name" />
                                <TextInput value={data.app_name} onChange={e => setData('app_name', e.target.value)} className="w-full mt-1" />
                                <InputError message={errors.app_name} className="mt-1" />
                            </div>
                            <div>
                                <InputLabel value="App URL" />
                                <TextInput value={data.app_url} onChange={e => setData('app_url', e.target.value)} className="w-full mt-1" />
                                <InputError message={errors.app_url} className="mt-1" />
                            </div>
                            <div className="md:col-span-2">
                                <InputLabel value="Description" />
                                <TextInput value={data.app_desc} onChange={e => setData('app_desc', e.target.value)} className="w-full mt-1" />
                            </div>
                            <div>
                                <InputLabel value="Environment" />
                                <select 
                                    value={data.app_env} 
                                    onChange={e => setData('app_env', e.target.value)}
                                    className="w-full mt-1 rounded-xl border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                                >
                                    <option value="local">Local</option>
                                    <option value="production">Production</option>
                                    <option value="staging">Staging</option>
                                </select>
                            </div>
                            <div className="flex items-center pt-6">
                                <Checkbox name="app_debug" checked={data.app_debug} onChange={e => setData('app_debug', e.target.checked)} />
                                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Enable Debug Mode</span>
                            </div>
                            <div>
                                <InputLabel value="Timezone" />
                                <TextInput value={data.app_timezone} onChange={e => setData('app_timezone', e.target.value)} className="w-full mt-1" />
                            </div>
                            <div>
                                <InputLabel value="Time Format" />
                                <select 
                                    value={data.app_time_format} 
                                    onChange={e => setData('app_time_format', e.target.value)}
                                    className="w-full mt-1 rounded-xl border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                                >
                                    <option value="12-Hour">12-Hour</option>
                                    <option value="24-Hour">24-Hour</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* 2. SYSTEM & FILES */}
                    <div className={sectionClass}>
                        <div className={headerClass}>
                            <div className={`${iconBoxClass} text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20`}>
                                <Icon icon="solar:server-square-bold-duotone" width="24" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">System & Files</h3>
                                <p className="text-sm text-gray-500">Logo, backups, and upload limits.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <InputLabel value="Site Logo" />
                                <div className="mt-2 flex gap-4 items-center">
                                    {logoPreview && <img src={logoPreview} className="h-12 w-auto object-contain bg-gray-50 rounded p-1" />}
                                    <input type="file" onChange={e => handleFileChange(e, 'logo')} className="text-sm text-gray-500" />
                                </div>
                            </div>
                            <div>
                                <InputLabel value="Favicon" />
                                <div className="mt-2 flex gap-4 items-center">
                                    {faviconPreview && <img src={faviconPreview} className="h-8 w-8 object-contain" />}
                                    <input type="file" onChange={e => handleFileChange(e, 'favicon')} className="text-sm text-gray-500" />
                                </div>
                            </div>
                            <div>
                                <InputLabel value="Admin URL Prefix" />
                                <TextInput value={data.system_admin_url_prefix} onChange={e => setData('system_admin_url_prefix', e.target.value)} className="w-full mt-1" />
                            </div>
                            <div>
                                <InputLabel value="Max Upload Size (KB)" />
                                <TextInput type="number" value={data.system_max_file_upload} onChange={e => setData('system_max_file_upload', parseInt(e.target.value))} className="w-full mt-1" />
                            </div>
                        </div>
                    </div>

                    {/* 3. AUTHENTICATION */}
                    <div className={sectionClass}>
                        <div className={headerClass}>
                            <div className={`${iconBoxClass} text-rose-600 bg-rose-50 dark:bg-rose-900/20`}>
                                <Icon icon="solar:shield-user-bold-duotone" width="24" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Authentication</h3>
                                <p className="text-sm text-gray-500">Security and access control.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="flex items-center space-x-3 p-3 border rounded-xl dark:border-gray-700">
                                <Checkbox checked={data.auth_public_register} onChange={e => setData('auth_public_register', e.target.checked)} />
                                <span className="text-sm text-gray-700 dark:text-gray-300">Public Registration</span>
                            </label>
                            <label className="flex items-center space-x-3 p-3 border rounded-xl dark:border-gray-700">
                                <Checkbox checked={data.auth_public_reset_password} onChange={e => setData('auth_public_reset_password', e.target.checked)} />
                                <span className="text-sm text-gray-700 dark:text-gray-300">Password Reset</span>
                            </label>
                            <label className="flex items-center space-x-3 p-3 border rounded-xl dark:border-gray-700">
                                <Checkbox checked={data.auth_verify_account} onChange={e => setData('auth_verify_account', e.target.checked)} />
                                <span className="text-sm text-gray-700 dark:text-gray-300">Email Verification</span>
                            </label>
                            <label className="flex items-center space-x-3 p-3 border rounded-xl dark:border-gray-700">
                                <Checkbox checked={data.auth_admin_create_user} onChange={e => setData('auth_admin_create_user', e.target.checked)} />
                                <span className="text-sm text-gray-700 dark:text-gray-300">Admin Create User</span>
                            </label>
                        </div>
                    </div>

                    {/* 4. THEME */}
                    <div className={sectionClass}>
                        <div className={headerClass}>
                            <div className={`${iconBoxClass} text-amber-600 bg-amber-50 dark:bg-amber-900/20`}>
                                <Icon icon="solar:palette-bold-duotone" width="24" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Theme & Layout</h3>
                                <p className="text-sm text-gray-500">Look and feel configuration.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <InputLabel value="Primary Color" />
                                <div className="flex gap-2 mt-1">
                                    <input type="color" value={data.theme_color_primary} onChange={e => setData('theme_color_primary', e.target.value)} className="h-10 w-10 rounded cursor-pointer" />
                                    <TextInput value={data.theme_color_primary} onChange={e => setData('theme_color_primary', e.target.value)} className="flex-1 uppercase" />
                                </div>
                            </div>
                            <div>
                                <InputLabel value="Secondary Color" />
                                <div className="flex gap-2 mt-1">
                                    <input type="color" value={data.theme_color_secondary} onChange={e => setData('theme_color_secondary', e.target.value)} className="h-10 w-10 rounded cursor-pointer" />
                                    <TextInput value={data.theme_color_secondary} onChange={e => setData('theme_color_secondary', e.target.value)} className="flex-1 uppercase" />
                                </div>
                            </div>
                            <div>
                                <InputLabel value="Layout Mode" />
                                <div className="flex gap-4 mt-2">
                                    <label className="flex items-center gap-2">
                                        <input type="radio" value="full_mode" checked={data.theme_layout_mode === 'full_mode'} onChange={e => setData('theme_layout_mode', e.target.value)} />
                                        <span className="text-sm dark:text-gray-300">Full Width</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input type="radio" value="boxed_mode" checked={data.theme_layout_mode === 'boxed_mode'} onChange={e => setData('theme_layout_mode', e.target.value)} />
                                        <span className="text-sm dark:text-gray-300">Boxed</span>
                                    </label>
                                </div>
                            </div>
                            <div className="flex items-center pt-6">
                                <Checkbox checked={data.theme_auto_dark_mode} onChange={e => setData('theme_auto_dark_mode', e.target.checked)} />
                                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Force Auto Dark Mode</span>
                            </div>
                        </div>
                    </div>

                    {/* 5. SOCIAL */}
                    <div className={sectionClass}>
                        <div className={headerClass}>
                            <div className={`${iconBoxClass} text-blue-600 bg-blue-50 dark:bg-blue-900/20`}>
                                <Icon icon="solar:share-circle-bold-duotone" width="24" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Social Media</h3>
                                <p className="text-sm text-gray-500">Links for footer or contact.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <InputLabel value="Github URL" />
                                <div className="relative mt-1">
                                    <Icon icon="mdi:github" className="absolute left-3 top-3 text-gray-400" />
                                    <TextInput value={data.social_github} onChange={e => setData('social_github', e.target.value)} className="w-full pl-10" />
                                </div>
                            </div>
                            <div>
                                <InputLabel value="Instagram URL" />
                                <div className="relative mt-1">
                                    <Icon icon="mdi:instagram" className="absolute left-3 top-3 text-gray-400" />
                                    <TextInput value={data.social_instagram} onChange={e => setData('social_instagram', e.target.value)} className="w-full pl-10" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ACTION BUTTON */}
                    <div className="fixed bottom-6 right-6 z-40">
                        <PrimaryButton 
                            className="px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 hover:scale-105 transition-transform"
                            disabled={processing}
                            style={{ backgroundColor: primaryColor }}
                        >
                            {processing ? <Icon icon="svg-spinners:90-ring-with-bg" /> : <Icon icon="solar:disk-bold-duotone" />}
                            <span>Save Changes</span>
                        </PrimaryButton>
                    </div>

                </form>
            </div>
        </AuthenticatedLayout>
    );
}