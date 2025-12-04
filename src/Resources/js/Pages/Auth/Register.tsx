import { useEffect, FormEventHandler } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import InputError from '../../Components/InputError';
import InputLabel from '../../Components/InputLabel';
import PrimaryButton from '../../Components/PrimaryButton';
import TextInput from '../../Components/TextInput';
import LogoDefault from '../../Components/LogoDefault';
// import styles from './Login.module.css'; // HAPUS baris ini karena file sudah tidak ada
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
        // Ganti styles.loginContainer dengan styling Tailwind langsung
        // Gunakan min-h-screen dll sesuai prefix yang Anda pertahankan
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-50 to-gray-200"
             style={{ 
                 backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', 
                 backgroundSize: '24px 24px' 
             }}>
            
            {/* Judul Halaman Dinamis */}
            <Head title={`${appName} - Register`} />

            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-6"
            >
                <div className="flex justify-center mb-4">
                    {/* Container Logo dengan styling inline */}
                    <div className="mx-auto h-14 w-14 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl shadow-lg flex items-center justify-center text-white mb-4 transform transition-transform duration-300 hover:scale-105 hover:rotate-3">
                         <LogoDefault textClassName="hidden" />
                    </div>
                </div>

                <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                    Buat Akun Baru
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                    Bergabunglah dengan {appName}.
                </p>
            </motion.div>

            {/* Form Card dengan styling langsung menggantikan styles.loginCard */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="w-full max-w-md mt-6 px-8 py-8 bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100 backdrop-blur-sm"
            >
                <form onSubmit={submit} className="space-y-5">
                    {/* Nama Lengkap */}
                    <div>
                        <InputLabel htmlFor="name" value="Nama Lengkap" />
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Icon icon="heroicons:user" className="text-gray-400" />
                            </div>
                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                className="mt-1 pl-10"
                                autoComplete="name"
                                isFocused={true}
                                placeholder="John Doe"
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                        </div>
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    {/* Email */}
                    <div>
                        <InputLabel htmlFor="email" value="Alamat Email" />
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Icon icon="heroicons:envelope" className="text-gray-400" />
                            </div>
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 pl-10"
                                autoComplete="username"
                                placeholder="nama@perusahaan.com"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                        </div>
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    {/* Password */}
                    <div>
                        <InputLabel htmlFor="password" value="Password" />
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Icon icon="heroicons:lock-closed" className="text-gray-400" />
                            </div>
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 pl-10"
                                autoComplete="new-password"
                                placeholder="••••••••"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                        </div>
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    {/* Konfirmasi Password */}
                    <div>
                        <InputLabel htmlFor="password_confirmation" value="Konfirmasi Password" />
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Icon icon="heroicons:shield-check" className="text-gray-400" />
                            </div>
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="mt-1 pl-10"
                                autoComplete="new-password"
                                placeholder="••••••••"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                            />
                        </div>
                        <InputError message={errors.password_confirmation} className="mt-2" />
                    </div>

                    <div className="pt-2">
                        <PrimaryButton className="w-full justify-center" disabled={processing}>
                            {processing ? (
                                <span className="flex items-center">
                                    <Icon icon="eos-icons:loading" className="animate-spin mr-2" />
                                    Mendaftarkan...
                                </span>
                            ) : (
                                <span className="flex items-center">
                                    <Icon icon="heroicons:paper-airplane" className="mr-2" />
                                    Daftar Sekarang
                                </span>
                            )}
                        </PrimaryButton>
                    </div>

                    <div className="flex items-center justify-center mt-4">
                        <span className="text-sm text-gray-600 mr-1">Sudah punya akun?</span>
                        <a 
                            href={safeRoute('futurisme.login', `/${urlPrefix}/login`)}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition-colors"
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
                className="mt-8 text-center"
            >
                <p className="text-xs text-gray-400">
                    &copy; {new Date().getFullYear()} {appName}.
                </p>
            </motion.div>
        </div>
    );
}