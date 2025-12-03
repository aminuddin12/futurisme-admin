import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import styles from '../Auth/Login.module.css';
import PrimaryButton from '../../Components/PrimaryButton';
import TextInput from '../../Components/TextInput';
import InputLabel from '../../Components/InputLabel';
import InputError from '../../Components/InputError';

// Helper SUPER AMAN untuk route (Konsisten)
const safeRoute = (name: string, fallbackUrl: string): string => {
    try {
        // @ts-ignore
        if (typeof window.route !== 'function') return fallbackUrl;
        // @ts-ignore
        const r: any = window.route();
        if (r && typeof r.has === 'function' && r.has(name)) {
            // @ts-ignore
            return window.route(name);
        }
    } catch (e) {}
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
        
        const url = safeRoute('futurisme.setup.admin.store', '/fu-settings/admin/save');
        console.log('Submitting Admin Account to:', url);
        post(url);
    };

    return (
        <div className={styles.loginContainer}>
            <Head title="Installation Wizard - Step 2" />

            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="fa-text-center fa-mb-6"
            >
                <div className="fa-flex fa-justify-center fa-mb-4">
                    <Icon icon="heroicons:user-plus" className="fa-text-indigo-600" width="48" height="48" />
                </div>
                <h2 className="fa-text-3xl fa-font-extrabold fa-text-gray-900">
                    Create Super Admin
                </h2>
                <p className="fa-mt-2 fa-text-sm fa-text-gray-500">
                    Step 2: Create your first administrative account.
                </p>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={styles.loginCard}
            >
                <form onSubmit={submit} className="fa-space-y-6">
                    {/* Name */}
                    <div>
                        <InputLabel value="Full Name" />
                        <div className="fa-relative">
                            <div className="fa-absolute fa-inset-y-0 fa-left-0 fa-pl-3 fa-flex fa-items-center fa-pointer-events-none">
                                <Icon icon="heroicons:user" className="fa-text-gray-400" />
                            </div>
                            <TextInput
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="fa-mt-1 fa-pl-10"
                                autoComplete="name"
                                placeholder="John Doe"
                            />
                        </div>
                        <InputError message={errors.name} className="fa-mt-2" />
                    </div>

                    {/* Email */}
                    <div>
                        <InputLabel value="Email Address" />
                        <div className="fa-relative">
                            <div className="fa-absolute fa-inset-y-0 fa-left-0 fa-pl-3 fa-flex fa-items-center fa-pointer-events-none">
                                <Icon icon="heroicons:envelope" className="fa-text-gray-400" />
                            </div>
                            <TextInput
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="fa-mt-1 fa-pl-10"
                                autoComplete="email"
                                placeholder="admin@example.com"
                            />
                        </div>
                        <InputError message={errors.email} className="fa-mt-2" />
                    </div>

                    {/* Password */}
                    <div>
                        <InputLabel value="Password" />
                        <div className="fa-relative">
                            <div className="fa-absolute fa-inset-y-0 fa-left-0 fa-pl-3 fa-flex fa-items-center fa-pointer-events-none">
                                <Icon icon="heroicons:lock-closed" className="fa-text-gray-400" />
                            </div>
                            <TextInput
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="fa-mt-1 fa-pl-10"
                                autoComplete="new-password"
                                placeholder="••••••••"
                            />
                        </div>
                        <InputError message={errors.password} className="fa-mt-2" />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <InputLabel value="Confirm Password" />
                        <div className="fa-relative">
                            <div className="fa-absolute fa-inset-y-0 fa-left-0 fa-pl-3 fa-flex fa-items-center fa-pointer-events-none">
                                <Icon icon="heroicons:shield-check" className="fa-text-gray-400" />
                            </div>
                            <TextInput
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                className="fa-mt-1 fa-pl-10"
                                autoComplete="new-password"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <PrimaryButton className="fa-w-full fa-justify-center" disabled={processing}>
                        {processing ? (
                            <span className="fa-flex fa-items-center">
                                <Icon icon="eos-icons:loading" className="fa-animate-spin fa-mr-2" />
                                Processing...
                            </span>
                        ) : (
                            'Finish Installation'
                        )}
                    </PrimaryButton>
                </form>
            </motion.div>
        </div>
    );
}