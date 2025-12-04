import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
// import styles from '../Auth/Login.module.css'; // HAPUS baris ini
import PrimaryButton from '../../Components/PrimaryButton';
import TextInput from '../../Components/TextInput';
import InputLabel from '../../Components/InputLabel';
import InputError from '../../Components/InputError';
import Checkbox from '../../Components/Checkbox';
// Import helper safeRoute yang sudah dibuat (opsional, tapi disarankan pakai helper terpusat)
import { safeRoute } from '../../Utils/routeHelper'; 

export default function Configuration() {
    const { data, setData, post, processing, errors } = useForm({
        site_name: 'Futurisme Admin',
        url_prefix: 'admin',
        can_register: false,
        theme_color: 'indigo',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        // Gunakan safeRoute dengan fallback URL manual
        const url = safeRoute('futurisme.setup.config.store', '/fu-settings/save');
        
        console.log('Submitting to:', url); 
        post(url);
    };

    return (
        // Ganti styles.loginContainer dengan styling Tailwind langsung
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-50 to-gray-200"
             style={{ 
                 backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', 
                 backgroundSize: '24px 24px' 
             }}>

            <Head title="Installation Wizard - Step 1" />

            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-6"
            >
                <div className="flex justify-center mb-4">
                    <Icon icon="heroicons:cog-6-tooth" className="text-indigo-600" width="48" height="48" />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900">
                    Installation Wizard
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                    Step 1: System Configuration
                </p>
            </motion.div>

            {/* Form Card dengan styling langsung */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md mt-6 px-8 py-8 bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100 backdrop-blur-sm"
            >
                <form onSubmit={submit} className="space-y-6">
                    {/* Site Name */}
                    <div>
                        <InputLabel value="Site Name" />
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Icon icon="heroicons:globe-alt" className="text-gray-400" />
                            </div>
                            <TextInput
                                value={data.site_name}
                                onChange={(e) => setData('site_name', e.target.value)}
                                className="mt-1 pl-10"
                                placeholder="My Awesome App"
                            />
                        </div>
                        <InputError message={errors.site_name} className="mt-2" />
                    </div>

                    {/* URL Prefix */}
                    <div>
                        <InputLabel value="Admin URL Prefix" />
                        <div className="flex items-center">
                            <span className="text-gray-500 mr-2 text-sm">yourdomain.com/</span>
                            <TextInput
                                value={data.url_prefix}
                                onChange={(e) => setData('url_prefix', e.target.value)}
                                className="mt-1"
                                placeholder="admin"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Use 'admin', 'panel', 'backend', etc.
                        </p>
                        <InputError message={errors.url_prefix} className="mt-2" />
                    </div>

                    {/* Theme Color */}
                    <div>
                        <InputLabel value="Theme Color" />
                        <div className="relative">
                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Icon icon="heroicons:paint-brush" className="text-gray-400" />
                            </div>
                            <select
                                value={data.theme_color}
                                onChange={(e) => setData('theme_color', e.target.value)}
                                className="mt-1 block w-full pl-10 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                                <option value="indigo">Indigo (Default)</option>
                                <option value="red">Red</option>
                                <option value="green">Green</option>
                                <option value="blue">Blue</option>
                            </select>
                        </div>
                    </div>

                    {/* Checkbox */}
                    <div className="block">
                        <label className="flex items-center">
                            <Checkbox
                                name="can_register"
                                checked={data.can_register}
                                onChange={(e) => setData('can_register', e.target.checked)}
                            />
                            <span className="ml-2 text-sm text-gray-600">
                                Allow public registration?
                            </span>
                        </label>
                    </div>

                    <PrimaryButton className="w-full justify-center" disabled={processing}>
                        {processing ? (
                            <span className="flex items-center">
                                <Icon icon="eos-icons:loading" className="animate-spin mr-2" />
                                Saving...
                            </span>
                        ) : (
                            <span className="flex items-center">
                                Next: Create Admin Account
                                <Icon icon="heroicons:arrow-right" className="ml-2" />
                            </span>
                        )}
                    </PrimaryButton>
                </form>
            </motion.div>
        </div>
    );
}