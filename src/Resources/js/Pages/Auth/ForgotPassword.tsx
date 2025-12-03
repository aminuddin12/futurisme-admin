import { Head, useForm, Link, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import LogoDefault from '../../Components/LogoDefault';
import InputError from '../../Components/InputError';
import PrimaryButton from '../../Components/PrimaryButton';
import TextInput from '../../Components/TextInput';
import styles from './Login.module.css';
// Import helper
import { safeRoute } from '../../Utils/routeHelper';

export default function ForgotPassword({ status }: { status?: string }) {
    // Ambil Config
    const { config } = usePage().props as any;
    const urlPrefix = config?.url_prefix || 'admin';
    const canRegister = config?.can_register;
    const appName = config?.site_name || 'Futurisme Admin';

    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        const url = safeRoute('futurisme.password.email', `/${urlPrefix}/forgot-password`);
        post(url);
    };

    return (
        <div className={styles.loginContainer}>
            {/* Judul Halaman Dinamis */}
            <Head title={`${appName} - Lupa Password`} />

            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="fa-text-center fa-mb-6"
            >
                <div className="fa-flex fa-justify-center fa-mb-4">
                    <LogoDefault />
                </div>
                
                <h2 className="fa-text-2xl fa-font-bold fa-text-gray-900">
                    Reset Password
                </h2>
                <p className="fa-mt-2 fa-text-sm fa-text-gray-500 fa-max-w-xs fa-mx-auto">
                    Masukkan email Anda dan kami akan mengirimkan tautan untuk mereset kata sandi Anda.
                </p>
            </motion.div>

            {status && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fa-mb-4 fa-font-medium fa-text-sm fa-text-green-600 fa-text-center fa-bg-green-50 fa-p-3 fa-rounded-lg"
                >
                    <div className="fa-flex fa-items-center fa-justify-center fa-gap-2">
                        <Icon icon="heroicons:check-circle" className="fa-w-5 fa-h-5" />
                        {status}
                    </div>
                </motion.div>
            )}

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className={styles.loginCard}
            >
                <form onSubmit={submit} className="fa-space-y-6">
                    <div>
                        <div className="fa-relative">
                            <div className="fa-absolute fa-inset-y-0 fa-left-0 fa-pl-3 fa-flex fa-items-center fa-pointer-events-none">
                                <Icon icon="heroicons:envelope" className="fa-text-gray-400" />
                            </div>
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="fa-mt-1 fa-pl-10"
                                isFocused={true}
                                placeholder="nama@email.com"
                                onChange={(e) => setData('email', e.target.value)}
                            />
                        </div>
                        <InputError message={errors.email} className="fa-mt-2" />
                    </div>

                    <div className="fa-pt-2">
                        <PrimaryButton className="fa-w-full fa-justify-center" disabled={processing}>
                            {processing ? (
                                <span className="fa-flex fa-items-center">
                                    <Icon icon="eos-icons:loading" className="fa-animate-spin fa-mr-2" />
                                    Mengirim...
                                </span>
                            ) : (
                                <span className="fa-flex fa-items-center">
                                    <Icon icon="heroicons:paper-airplane" className="fa-mr-2" />
                                    Kirim Link Reset
                                </span>
                            )}
                        </PrimaryButton>
                    </div>

                    <div className="fa-flex fa-items-center fa-justify-between fa-mt-6 fa-pt-4 fa-border-t fa-border-gray-100">
                        <a 
                            href={safeRoute('futurisme.login', `/${urlPrefix}/login`)}
                            className="fa-text-sm fa-font-medium fa-text-gray-600 hover:fa-text-indigo-600 fa-flex fa-items-center fa-gap-1 fa-transition-colors"
                        >
                            <Icon icon="heroicons:arrow-left" className="fa-w-3 fa-h-3" />
                            Kembali ke Login
                        </a>

                        {canRegister && (
                            <a 
                                href={safeRoute('futurisme.register', `/${urlPrefix}/register`)}
                                className="fa-text-sm fa-font-medium fa-text-indigo-600 hover:fa-text-indigo-500 hover:fa-underline fa-transition-colors"
                            >
                                Daftar Akun
                            </a>
                        )}
                    </div>
                </form>
            </motion.div>
            
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="fa-mt-8 fa-text-center"
            >
                <p className="fa-text-xs fa-text-gray-400">
                    &copy; {new Date().getFullYear()} {appName}.
                </p>
            </motion.div>
        </div>
    );
}