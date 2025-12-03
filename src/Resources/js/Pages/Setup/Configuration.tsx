import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import styles from '../Auth/Login.module.css'; // Reuse style login biar konsisten
import PrimaryButton from '../../Components/PrimaryButton';
import TextInput from '../../Components/TextInput';
import InputLabel from '../../Components/InputLabel';
import InputError from '../../Components/InputError';
import Checkbox from '../../Components/Checkbox';

// Helper SUPER AMAN untuk route (Diperbarui agar konsisten dengan Login.tsx)
const safeRoute = (name: string, fallbackUrl: string): string => {
    try {
        // @ts-ignore
        if (typeof window.route !== 'function') {
            console.warn('[Futurisme] window.route function is missing.');
            return fallbackUrl;
        }

        // @ts-ignore
        // Cek apakah Ziggy config ada (opsional, route() function biasanya sudah cukup)
        if (typeof window.Ziggy === 'undefined') {
             // console.warn('[Futurisme] window.Ziggy config is missing.');
             // return fallbackUrl; 
        }

        // Panggil route() dan cast ke 'any'
        // @ts-ignore
        const r: any = window.route();

        // Cek hasil panggilannya valid
        if (r && typeof r.has === 'function') {
            if (r.has(name)) {
                // @ts-ignore
                return window.route(name);
            } else {
                console.warn(`[Futurisme] Route '${name}' not found in Ziggy list.`);
            }
        }
    } catch (e) {
        console.error('[Futurisme] Ziggy error:', e);
    }

    return fallbackUrl;
};

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
        <div className={styles.loginContainer}>
            <Head title="Installation Wizard - Step 1" />

            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="fa-text-center fa-mb-6"
            >
                <div className="fa-flex fa-justify-center fa-mb-4">
                    <Icon icon="heroicons:cog-6-tooth" className="fa-text-indigo-600" width="48" height="48" />
                </div>
                <h2 className="fa-text-3xl fa-font-extrabold fa-text-gray-900">
                    Installation Wizard
                </h2>
                <p className="fa-mt-2 fa-text-sm fa-text-gray-500">
                    Step 1: System Configuration
                </p>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={styles.loginCard}
            >
                <form onSubmit={submit} className="fa-space-y-6">
                    {/* Site Name */}
                    <div>
                        <InputLabel value="Site Name" />
                        <div className="fa-relative">
                            <div className="fa-absolute fa-inset-y-0 fa-left-0 fa-pl-3 fa-flex fa-items-center fa-pointer-events-none">
                                <Icon icon="heroicons:globe-alt" className="fa-text-gray-400" />
                            </div>
                            <TextInput
                                value={data.site_name}
                                onChange={(e) => setData('site_name', e.target.value)}
                                className="fa-mt-1 fa-pl-10"
                                placeholder="My Awesome App"
                            />
                        </div>
                        <InputError message={errors.site_name} className="fa-mt-2" />
                    </div>

                    {/* URL Prefix */}
                    <div>
                        <InputLabel value="Admin URL Prefix" />
                        <div className="fa-flex fa-items-center">
                            <span className="fa-text-gray-500 fa-mr-2 fa-text-sm">yourdomain.com/</span>
                            <TextInput
                                value={data.url_prefix}
                                onChange={(e) => setData('url_prefix', e.target.value)}
                                className="fa-mt-1"
                                placeholder="admin"
                            />
                        </div>
                        <p className="fa-text-xs fa-text-gray-500 fa-mt-1">
                            Use 'admin', 'panel', 'backend', etc.
                        </p>
                        <InputError message={errors.url_prefix} className="fa-mt-2" />
                    </div>

                    {/* Theme Color */}
                    <div>
                        <InputLabel value="Theme Color" />
                        <div className="fa-relative">
                             <div className="fa-absolute fa-inset-y-0 fa-left-0 fa-pl-3 fa-flex fa-items-center fa-pointer-events-none">
                                <Icon icon="heroicons:paint-brush" className="fa-text-gray-400" />
                            </div>
                            <select
                                value={data.theme_color}
                                onChange={(e) => setData('theme_color', e.target.value)}
                                className="fa-mt-1 fa-block fa-w-full fa-pl-10 fa-pr-10 fa-py-2 fa-text-base fa-border-gray-300 focus:fa-outline-none focus:fa-ring-indigo-500 focus:fa-border-indigo-500 sm:fa-text-sm fa-rounded-md"
                            >
                                <option value="indigo">Indigo (Default)</option>
                                <option value="red">Red</option>
                                <option value="green">Green</option>
                                <option value="blue">Blue</option>
                            </select>
                        </div>
                    </div>

                    {/* Checkbox */}
                    <div className="fa-block">
                        <label className="fa-flex fa-items-center">
                            <Checkbox
                                name="can_register"
                                checked={data.can_register}
                                onChange={(e) => setData('can_register', e.target.checked)}
                            />
                            <span className="fa-ml-2 fa-text-sm fa-text-gray-600">
                                Allow public registration?
                            </span>
                        </label>
                    </div>

                    <PrimaryButton className="fa-w-full fa-justify-center" disabled={processing}>
                        {processing ? (
                            <span className="fa-flex fa-items-center">
                                <Icon icon="eos-icons:loading" className="fa-animate-spin fa-mr-2" />
                                Saving...
                            </span>
                        ) : (
                            <span className="fa-flex fa-items-center">
                                Next: Create Admin Account
                                <Icon icon="heroicons:arrow-right" className="fa-ml-2" />
                            </span>
                        )}
                    </PrimaryButton>
                </form>
            </motion.div>
        </div>
    );
}