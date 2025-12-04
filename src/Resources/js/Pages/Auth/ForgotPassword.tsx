import { Head, useForm, Link, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import LogoDefault from '../../Components/LogoDefault';
import InputError from '../../Components/InputError';
import PrimaryButton from '../../Components/PrimaryButton';
import TextInput from '../../Components/TextInput';
// import styles from './Login.module.css'; // HAPUS baris ini karena file sudah tidak ada
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
        // Ganti styles.loginContainer dengan styling Tailwind langsung
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-50 to-gray-200"
             style={{ 
                 backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', 
                 backgroundSize: '24px 24px' 
             }}>

            {/* Judul Halaman Dinamis */}
            <Head title={`${appName} - Lupa Password`} />

            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-6"
            >
                <div className="flex justify-center mb-4">
                    {/* Container Logo dengan styling inline */}
                    <div className="mx-auto h-14 w-14 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl shadow-lg flex items-center justify-center text-white mb-4 transform transition-transform duration-300 hover:scale-105 hover:rotate-3">
                         <LogoDefault textClassName="hidden" />
                    </div>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900">
                    Reset Password
                </h2>
                <p className="mt-2 text-sm text-gray-500 max-w-xs mx-auto">
                    Masukkan email Anda dan kami akan mengirimkan tautan untuk mereset kata sandi Anda.
                </p>
            </motion.div>

            {status && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full max-w-md mb-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-md shadow-sm"
                >
                    <div className="flex items-center justify-center gap-2">
                        <Icon icon="heroicons:check-circle" className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-green-700">{status}</span>
                    </div>
                </motion.div>
            )}

            {/* Form Card dengan styling langsung */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="w-full max-w-md mt-6 px-8 py-8 bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100 backdrop-blur-sm"
            >
                <form onSubmit={submit} className="space-y-6">
                    <div>
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
                                isFocused={true}
                                placeholder="nama@email.com"
                                onChange={(e) => setData('email', e.target.value)}
                            />
                        </div>
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div className="pt-2">
                        <PrimaryButton className="w-full justify-center" disabled={processing}>
                            {processing ? (
                                <span className="flex items-center">
                                    <Icon icon="eos-icons:loading" className="animate-spin mr-2" />
                                    Mengirim...
                                </span>
                            ) : (
                                <span className="flex items-center">
                                    <Icon icon="heroicons:paper-airplane" className="mr-2" />
                                    Kirim Link Reset
                                </span>
                            )}
                        </PrimaryButton>
                    </div>

                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                        <a 
                            href={safeRoute('futurisme.login', `/${urlPrefix}/login`)}
                            className="text-sm font-medium text-gray-600 hover:text-indigo-600 flex items-center gap-1 transition-colors"
                        >
                            <Icon icon="heroicons:arrow-left" className="w-3 h-3" />
                            Kembali ke Login
                        </a>

                        {canRegister && (
                            <a 
                                href={safeRoute('futurisme.register', `/${urlPrefix}/register`)}
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition-colors"
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
                className="mt-8 text-center"
            >
                <p className="text-xs text-gray-400">
                    &copy; {new Date().getFullYear()} {appName}.
                </p>
            </motion.div>
        </div>
    );
}