import { useEffect, useState, FormEventHandler, CSSProperties } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import LogoDefault from '@/Components/LogoDefault';
import AuthArtwork from './AuthArtwork';
import ThemeToggle from '@/Components/Theme/ThemeToggle';
import { safeRoute } from '@/Utils/routeHelper';

export default function Register() {
    // 1. Ambil Props & Config Global
    const { config, flash } = usePage().props as any;

    // --- CONFIGURATION MAPPING ---
    const appName = config?.site_name || 'Futurisme Admin';
    const siteLogo = config?.logo_url;
    const urlPrefix = config?.url_prefix || 'admin';
    
    // Theme Settings
    const rawPrimaryColor = config?.theme?.color_primary;
    const primaryColor = (rawPrimaryColor === 'default' || !rawPrimaryColor) ? '#4f46e5' : rawPrimaryColor;

    // -----------------------------------------------

    const [showFlash, setShowFlash] = useState(false);
    const [flashContent, setFlashContent] = useState<{ type: 'success' | 'error', message: string } | null>(null);

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

    // Flash Message Logic
    useEffect(() => {
        let message = null;
        let type: 'success' | 'error' = 'success';

        if (flash?.error) {
            message = flash.error;
            type = 'error';
        } else if (flash?.success) {
            message = flash.success;
            type = 'success';
        }

        if (message) {
            setFlashContent({ type, message });
            setShowFlash(true);
            const timer = setTimeout(() => setShowFlash(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        const fallbackUrl = `/${urlPrefix}/register`;
        const url = safeRoute('futurisme.register.store', fallbackUrl);
        post(url);
    };

    // Styling Objects
    const dynamicPrimaryStyle: CSSProperties = {
        backgroundColor: primaryColor,
        borderColor: primaryColor,
    };
    
    const dynamicTextStyle: CSSProperties = {
        color: primaryColor,
    };

    const dynamicRingStyle: CSSProperties = {
        '--tw-ring-color': primaryColor,
    } as React.CSSProperties;

    return (
        <div className="flex min-h-screen bg-white dark:bg-gray-950 overflow-hidden transition-colors duration-500">
            <Head title={`${appName} - Register`} />

            {/* --- FLASH MESSAGE WRAPPER --- */}
            <div className="fixed top-24 right-6 z-50 w-full max-w-sm flex flex-col items-end pointer-events-none">
                 <AnimatePresence>
                    {showFlash && flashContent && (
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50, scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="pointer-events-auto shadow-2xl drop-shadow-lg"
                        >
                            <div className={`
                                flex items-center gap-3 px-4 py-3 rounded-xl border border-l-4 backdrop-blur-md bg-white/90 dark:bg-gray-800/90
                                ${flashContent.type === 'error' 
                                    ? 'border-l-rose-500 border-y-rose-100 border-r-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400' 
                                    : 'border-l-emerald-500 border-y-emerald-100 border-r-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                                }
                            `}>
                                <Icon 
                                    icon={flashContent.type === 'error' ? "solar:danger-triangle-bold" : "solar:check-circle-bold"} 
                                    className="w-5 h-5 flex-shrink-0" 
                                />
                                <span className="text-sm font-medium">{flashContent.message}</span>
                                <button 
                                    onClick={() => setShowFlash(false)}
                                    className="ml-2 p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <Icon icon="solar:close-circle-bold" className="w-4 h-4 opacity-50" />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* --- LAYOUT KIRI: ARTWORK (60%) --- */}
            <div className="hidden lg:block lg:w-[60%] relative bg-slate-900 border-r border-gray-100 dark:border-gray-800 z-0">
                <AuthArtwork appName={appName} />
            </div>

            {/* --- LAYOUT KANAN: FORM (40%) --- */}
            <div className="w-full lg:w-[40%] flex flex-col justify-center items-center px-6 sm:px-12 lg:px-16 xl:px-24 relative z-10 py-12 lg:py-0 overflow-y-auto h-screen lg:h-auto">
                
                {/* Theme Toggle */}
                <div className="absolute top-6 right-6 z-40">
                    <ThemeToggle /> 
                </div>

                <div className="w-full max-w-[420px] py-8">
                    
                    {/* Header Section */}
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="mb-8 text-center lg:text-left"
                    >
                        {/* LOGO HANDLING */}
                        <div className="inline-flex items-center justify-center lg:justify-start gap-4 mb-6">
                            {siteLogo && siteLogo !== 'default_logo' ? (
                                <motion.img 
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    src={siteLogo} 
                                    alt={appName} 
                                    className="h-12 w-auto object-contain"
                                />
                            ) : (
                                <div 
                                    className="h-10 w-10 rounded-xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 transition-transform hover:scale-105 hover:rotate-3"
                                    style={{ backgroundColor: primaryColor }}
                                >
                                     <LogoDefault textClassName="hidden" iconClassName="w-6 h-6" />
                                </div>
                            )}
                            
                            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight leading-none">
                                {appName}
                            </span>
                        </div>
                        
                        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
                            Create Account
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                            Join us today and experience the future.
                        </p>
                    </motion.div>

                    {/* Form Section */}
                    <motion.form 
                        onSubmit={submit} 
                        className="space-y-5"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        {/* Name Input */}
                        <div>
                            <InputLabel htmlFor="name" value="Full Name" className="mb-1.5 text-gray-700 dark:text-gray-300 font-semibold text-xs uppercase tracking-wider" />
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Icon icon="solar:user-linear" className="text-gray-400 dark:text-gray-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors w-5 h-5" />
                                </div>
                                <TextInput
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    className="pl-12 py-3 w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white font-medium focus:ring-4 focus:ring-opacity-10 transition-all shadow-sm"
                                    style={dynamicRingStyle}
                                    autoComplete="name"
                                    isFocused={true}
                                    placeholder="John Doe"
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                            </div>
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        {/* Email Input */}
                        <div>
                            <InputLabel htmlFor="email" value="Email Address" className="mb-1.5 text-gray-700 dark:text-gray-300 font-semibold text-xs uppercase tracking-wider" />
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Icon icon="solar:letter-linear" className="text-gray-400 dark:text-gray-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors w-5 h-5" />
                                </div>
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="pl-12 py-3 w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white font-medium focus:ring-4 focus:ring-opacity-10 transition-all shadow-sm"
                                    style={dynamicRingStyle}
                                    autoComplete="username"
                                    placeholder="name@company.com"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                            </div>
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        {/* Password Input */}
                        <div>
                            <InputLabel htmlFor="password" value="Password" className="mb-1.5 text-gray-700 dark:text-gray-300 font-semibold text-xs uppercase tracking-wider" />
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Icon icon="solar:lock-password-linear" className="text-gray-400 dark:text-gray-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors w-5 h-5" />
                                </div>
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="pl-12 py-3 w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white font-medium focus:ring-4 focus:ring-opacity-10 transition-all shadow-sm"
                                    style={dynamicRingStyle}
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                            </div>
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        {/* Confirm Password Input */}
                        <div>
                            <InputLabel htmlFor="password_confirmation" value="Confirm Password" className="mb-1.5 text-gray-700 dark:text-gray-300 font-semibold text-xs uppercase tracking-wider" />
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Icon icon="solar:shield-check-linear" className="text-gray-400 dark:text-gray-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors w-5 h-5" />
                                </div>
                                <TextInput
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="pl-12 py-3 w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white font-medium focus:ring-4 focus:ring-opacity-10 transition-all shadow-sm"
                                    style={dynamicRingStyle}
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                />
                            </div>
                            <InputError message={errors.password_confirmation} className="mt-2" />
                        </div>

                        {/* Submit Button */}
                        <PrimaryButton 
                            className="w-full justify-center py-3.5 rounded-xl text-white shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-1 hover:shadow-xl font-bold text-[15px] tracking-wide mt-2" 
                            disabled={processing}
                            style={dynamicPrimaryStyle}
                        >
                            {processing ? (
                                <span className="flex items-center gap-2">
                                    <Icon icon="svg-spinners:90-ring-with-bg" className="w-5 h-5" />
                                    Creating Account...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Register Account
                                    <Icon icon="solar:user-plus-linear" className="w-5 h-5" />
                                </span>
                            )}
                        </PrimaryButton>
                    </motion.form>

                    {/* Footer / Login Link */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mt-8 text-center"
                    >
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Already registered?
                        </p>
                        <a 
                            href={safeRoute('futurisme.login', `/${urlPrefix}/login`)}
                            className="mt-1.5 inline-flex items-center gap-1 font-bold text-base hover:underline transition-colors"
                            style={dynamicTextStyle}
                        >
                            Sign in to your account
                            <Icon icon="solar:login-2-linear" className="w-4 h-4" />
                        </a>
                    </motion.div>
                    
                    <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-800/50">
                        <p className="text-xs text-center text-gray-400 dark:text-gray-600 font-medium">
                            &copy; {new Date().getFullYear()} {appName}. Secured & Encrypted.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}