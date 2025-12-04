import { useEffect, FormEventHandler } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
// Path relative digunakan agar kompatibel tanpa konfigurasi alias yang rumit
import Checkbox from '../../Components/Checkbox';
import InputError from '../../Components/InputError';
import InputLabel from '../../Components/InputLabel';
import PrimaryButton from '../../Components/PrimaryButton';
import TextInput from '../../Components/TextInput';
import LogoDefault from '../../Components/LogoDefault';
// import styles from './Login.module.css'; // Hapus import ini
import { safeRoute } from '../../Utils/routeHelper';

export default function Login({ status, canResetPassword }: { status?: string, canResetPassword?: boolean }) {
    // Ambil Config dari Props Global
    const { config } = usePage().props as any;
    const urlPrefix = config?.url_prefix || 'admin';
    const canRegister = config?.can_register; 
    // Ambil Nama Situs dari Config (Default: Futurisme Admin)
    const appName = config?.site_name || 'Futurisme Admin';

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        const fallbackUrl = `/${urlPrefix}/login`;
        const url = safeRoute('futurisme.login.store', fallbackUrl);
        post(url);
    };

    return (
        // Ganti styles.loginContainer dengan class Tailwind langsung
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-50 to-gray-200" 
             style={{ 
                 backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', 
                 backgroundSize: '24px 24px' 
             }}>
            
            {/* Judul Halaman Dinamis: Nama App - Login */}
            <Head title={`${appName} - Login`} />

            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-6"
            >
                <div className="flex justify-center mb-4">
                    {/* Container Logo dengan styling inline untuk efek hover/transform jika diperlukan */}
                    <div className="mx-auto h-14 w-14 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl shadow-lg flex items-center justify-center text-white mb-4 transform transition-transform duration-300 hover:scale-105 hover:rotate-3">
                         <LogoDefault textClassName="hidden" />
                    </div>
                </div>
                
                <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                    Selamat Datang Kembali
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                    Silakan masuk ke {appName} untuk melanjutkan.
                </p>
            </motion.div>

            {status && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md mb-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-md shadow-sm"
                >
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <Icon icon="heroicons:check-circle" className="h-5 w-5 text-green-400" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-green-700">{status}</p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Login Card dengan styling langsung */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full max-w-md mt-6 px-8 py-8 bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100 backdrop-blur-sm"
            >
                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <InputLabel htmlFor="email" value="Email Address" />
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
                                isFocused={true}
                                placeholder="nama@perusahaan.com"
                                onChange={(e) => setData('email', e.target.value)}
                            />
                        </div>
                        <InputError message={errors.email} className="mt-2" />
                    </div>

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
                                autoComplete="current-password"
                                placeholder="••••••••"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                        </div>
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center cursor-pointer">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                            />
                            <span className="ml-2 text-sm text-gray-600 hover:text-gray-900">Ingat saya</span>
                        </label>

                        {canResetPassword && (
                            <a
                                href={safeRoute('futurisme.password.request', `/${urlPrefix}/forgot-password`)}
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                            >
                                Lupa password?
                            </a>
                        )}
                    </div>

                    <div>
                        <PrimaryButton className="w-full justify-center" disabled={processing}>
                            {processing ? (
                                <span className="flex items-center">
                                    <Icon icon="eos-icons:loading" className="animate-spin mr-2" />
                                    Memproses...
                                </span>
                            ) : (
                                <span className="flex items-center">
                                    <Icon icon="heroicons:arrow-right-on-rectangle" className="mr-2" />
                                    Masuk ke Dashboard
                                </span>
                            )}
                        </PrimaryButton>
                    </div>

                    {canRegister && (
                        <div className="flex items-center justify-center mt-4 pt-2 border-t border-gray-100">
                            <span className="text-sm text-gray-600 mr-1">Belum punya akun?</span>
                            <a 
                                href={safeRoute('futurisme.register', `/${urlPrefix}/register`)}
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition-colors flex items-center"
                            >
                                <Icon icon="heroicons:user-plus" className="mr-1 w-4 h-4" />
                                Daftar sekarang
                            </a>
                        </div>
                    )}
                </form>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 text-center"
            >
                <p className="text-xs text-gray-400">
                    &copy; {new Date().getFullYear()} {appName}. Secured & Encrypted.
                </p>
            </motion.div>
        </div>
    );
}