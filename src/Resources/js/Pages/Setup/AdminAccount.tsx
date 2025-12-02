import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import styles from '../Auth/Login.module.css';
import PrimaryButton from '../../Components/PrimaryButton';
import TextInput from '../../Components/TextInput';
import InputLabel from '../../Components/InputLabel';
import InputError from '../../Components/InputError';

// Helper aman untuk route agar tidak crash jika Ziggy belum siap
// Sama persis dengan yang kita pakai di Configuration.tsx
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

export default function AdminAccount() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        // Gunakan safeRoute dengan URL manual '/fu-settings/admin/save'
        // Ini memastikan form tetap jalan walau Ziggy error
        const url = safeRoute('futurisme.setup.admin.store', '/fu-settings/admin/save');
        
        console.log('Submitting Admin Account to:', url);
        post(url);
    };

    return (
        <div className={styles.loginContainer}>
            <Head title="Installation Wizard - Step 2" />

            <div className="fa-text-center fa-mb-6">
                <h2 className="fa-text-3xl fa-font-extrabold fa-text-gray-900">
                    Create Super Admin
                </h2>
                <p className="fa-mt-2 fa-text-sm fa-text-gray-500">
                    Step 2: Create your first administrative account.
                </p>
            </div>

            <div className={styles.loginCard}>
                <form onSubmit={submit} className="fa-space-y-6">
                    {/* Name */}
                    <div>
                        <InputLabel value="Full Name" />
                        <TextInput
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="fa-mt-1"
                            autoComplete="name"
                            placeholder="John Doe"
                        />
                        <InputError message={errors.name} className="fa-mt-2" />
                    </div>

                    {/* Email */}
                    <div>
                        <InputLabel value="Email Address" />
                        <TextInput
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="fa-mt-1"
                            autoComplete="email"
                            placeholder="admin@example.com"
                        />
                        <InputError message={errors.email} className="fa-mt-2" />
                    </div>

                    {/* Password */}
                    <div>
                        <InputLabel value="Password" />
                        <TextInput
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="fa-mt-1"
                            autoComplete="new-password"
                            placeholder="••••••••"
                        />
                        <InputError message={errors.password} className="fa-mt-2" />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <InputLabel value="Confirm Password" />
                        <TextInput
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            className="fa-mt-1"
                            autoComplete="new-password"
                            placeholder="••••••••"
                        />
                    </div>

                    <PrimaryButton className="fa-w-full fa-justify-center" disabled={processing}>
                        Finish Installation
                    </PrimaryButton>
                </form>
            </div>
        </div>
    );
}