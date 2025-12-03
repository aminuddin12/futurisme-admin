import { useEffect, FormEventHandler } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import InputError from '../../Components/InputError';
import InputLabel from '../../Components/InputLabel';
import PrimaryButton from '../../Components/PrimaryButton';
import TextInput from '../../Components/TextInput';
import LogoDefault from '../../Components/LogoDefault';
import styles from './Login.module.css';
// Import helper
import { safeRoute } from '../../Utils/routeHelper';

export default function Register() {
    // Ambil Config
    const { config } = usePage().props as any;
    const urlPrefix = config?.url_prefix || 'admin';
    const appName = config?.site_name || 'Futurisme Admin';

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        const url = safeRoute('futurisme.register.store', `/${urlPrefix}/register`);
        post(url);
    };

    return (
        <div className={styles.loginContainer}>
            {/* Judul Halaman Dinamis */}
            <Head title={`${appName} - Register`} />

            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="fa-text-center fa-mb-6"
            >
                <div className="fa-flex fa-justify-center fa-mb-4">
                    <LogoDefault />
                </div>

                <h2 className="fa-text-2xl fa-font-extrabold fa-text-gray-900 fa-tracking-tight">
                    Buat Akun Baru
                </h2>
                <p className="fa-mt-2 fa-text-sm fa-text-gray-500">
                    Bergabunglah dengan {appName}.
                </p>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className={styles.loginCard}
            >
                <form onSubmit={submit} className="fa-space-y-5">
                    {/* ... (Field input name, email, password, confirm sama) ... */}
                    {/* (Saya singkat agar tidak terlalu panjang, isinya sama seperti sebelumnya) */}
                    <div>
                        <InputLabel htmlFor="name" value="Nama Lengkap" />
                        <div className="fa-relative">
                            <div className="fa-absolute fa-inset-y-0 fa-left-0 fa-pl-3 fa-flex fa-items-center fa-pointer-events-none">
                                <Icon icon="heroicons:user" className="fa-text-gray-400" />
                            </div>
                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                className="fa-mt-1 fa-pl-10"
                                autoComplete="name"
                                isFocused={true}
                                placeholder="John Doe"
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                        </div>
                        <InputError message={errors.name} className="fa-mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="email" value="Alamat Email" />
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
                                autoComplete="username"
                                placeholder="nama@perusahaan.com"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                        </div>
                        <InputError message={errors.email} className="fa-mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="password" value="Password" />
                        <div className="fa-relative">
                            <div className="fa-absolute fa-inset-y-0 fa-left-0 fa-pl-3 fa-flex fa-items-center fa-pointer-events-none">
                                <Icon icon="heroicons:lock-closed" className="fa-text-gray-400" />
                            </div>
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="fa-mt-1 fa-pl-10"
                                autoComplete="new-password"
                                placeholder="••••••••"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                        </div>
                        <InputError message={errors.password} className="fa-mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="password_confirmation" value="Konfirmasi Password" />
                        <div className="fa-relative">
                            <div className="fa-absolute fa-inset-y-0 fa-left-0 fa-pl-3 fa-flex fa-items-center fa-pointer-events-none">
                                <Icon icon="heroicons:shield-check" className="fa-text-gray-400" />
                            </div>
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="fa-mt-1 fa-pl-10"
                                autoComplete="new-password"
                                placeholder="••••••••"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                            />
                        </div>
                        <InputError message={errors.password_confirmation} className="fa-mt-2" />
                    </div>

                    <div className="fa-pt-2">
                        <PrimaryButton className="fa-w-full fa-justify-center" disabled={processing}>
                            {processing ? (
                                <span className="fa-flex fa-items-center">
                                    <Icon icon="eos-icons:loading" className="fa-animate-spin fa-mr-2" />
                                    Mendaftarkan...
                                </span>
                            ) : (
                                <span className="fa-flex fa-items-center">
                                    <Icon icon="heroicons:paper-airplane" className="fa-mr-2" />
                                    Daftar Sekarang
                                </span>
                            )}
                        </PrimaryButton>
                    </div>

                    <div className="fa-flex fa-items-center fa-justify-center fa-mt-4">
                        <span className="fa-text-sm fa-text-gray-600 fa-mr-1">Sudah punya akun?</span>
                        <a 
                            href={safeRoute('futurisme.login', `/${urlPrefix}/login`)}
                            className="fa-text-sm fa-font-medium fa-text-indigo-600 hover:fa-text-indigo-500 hover:fa-underline fa-transition-colors"
                        >
                            Masuk disini
                        </a>
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