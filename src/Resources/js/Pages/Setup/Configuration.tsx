import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import styles from '../Auth/Login.module.css'; // Reuse style login biar konsisten
import PrimaryButton from '../../Components/PrimaryButton';
import TextInput from '../../Components/TextInput';
import InputLabel from '../../Components/InputLabel';
import InputError from '../../Components/InputError';
import Checkbox from '../../Components/Checkbox';

// Helper aman untuk route dengan fallback URL manual
const safeRoute = (name: string, fallbackUrl: string): string => {
    try {
        // @ts-ignore
        if (typeof route === 'function') {
            // @ts-ignore
            if (route().has(name)) {
                // @ts-ignore
                return route(name);
            } else {
                console.warn(`[Futurisme] Route '${name}' not found in Ziggy. Using fallback.`);
            }
        }
    } catch (e) {
        console.error('[Futurisme] Ziggy route helper error:', e);
    }
    // Kembalikan URL manual jika Ziggy gagal
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
        
        // Gunakan safeRoute dengan fallback URL manual '/fu-settings/save'
        // Ini menjamin form tetap bisa submit meskipun Ziggy bermasalah/cache belum clear
        const url = safeRoute('futurisme.setup.config.store', '/fu-settings/save');
        
        console.log('Submitting to:', url); // Debugging log
        post(url);
    };

    return (
        <div className={styles.loginContainer}>
            <Head title="Installation Wizard - Step 1" />

            <div className="fa-text-center fa-mb-6">
                <h2 className="fa-text-3xl fa-font-extrabold fa-text-gray-900">
                    Installation Wizard
                </h2>
                <p className="fa-mt-2 fa-text-sm fa-text-gray-500">
                    Step 1: System Configuration
                </p>
            </div>

            <div className={styles.loginCard}>
                <form onSubmit={submit} className="fa-space-y-6">
                    {/* Site Name */}
                    <div>
                        <InputLabel value="Site Name" />
                        <TextInput
                            value={data.site_name}
                            onChange={(e) => setData('site_name', e.target.value)}
                            className="fa-mt-1"
                            placeholder="My Awesome App"
                        />
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
                        <select
                            value={data.theme_color}
                            onChange={(e) => setData('theme_color', e.target.value)}
                            className="fa-mt-1 fa-block fa-w-full fa-pl-3 fa-pr-10 fa-py-2 fa-text-base fa-border-gray-300 focus:fa-outline-none focus:fa-ring-indigo-500 focus:fa-border-indigo-500 sm:fa-text-sm fa-rounded-md"
                        >
                            <option value="indigo">Indigo (Default)</option>
                            <option value="red">Red</option>
                            <option value="green">Green</option>
                            <option value="blue">Blue</option>
                        </select>
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
                        Next: Create Admin Account
                    </PrimaryButton>
                </form>
            </div>
        </div>
    );
}