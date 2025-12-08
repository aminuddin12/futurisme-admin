import { useEffect, useState, FormEventHandler, CSSProperties } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import Checkbox from '../../Components/Checkbox';
import InputError from '../../Components/InputError';
import InputLabel from '../../Components/InputLabel';
import PrimaryButton from '../../Components/PrimaryButton';
import TextInput from '../../Components/TextInput';
import LogoDefault from '../../Components/LogoDefault';
import AuthArtwork from './AuthArtwork';
import ThemeToggle from '../../Components/Theme/ThemeToggle';
import { safeRoute } from '../../Utils/routeHelper';

interface LoginProps {
    status?: string;
    canResetPassword?: boolean;
    canRegister?: boolean; 
}

export default function Login({ status }: LoginProps) {
    const { config, flash } = usePage().props as any;

    const appName = config?.site_name || 'Futurisme Admin';
    const siteLogo = config?.logo_url;
    const urlPrefix = config?.admin_url_prefix || 'admin'; 
    

    const canRegister = config?.auth?.public_can_register ?? false;
    const canResetPassword = config?.auth?.public_can_reset_password ?? true;

    const rawPrimaryColor = config?.theme?.color_primary;
    const primaryColor = (rawPrimaryColor === 'default' || !rawPrimaryColor) ? '#4f46e5' : rawPrimaryColor;


    const [showFlash, setShowFlash] = useState(false);
    const [flashContent, setFlashContent] = useState<{ type: 'success' | 'error', message: string } | null>(null);

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

    useEffect(() => {
        let message = null;
        let type: 'success' | 'error' = 'success';

        if (flash?.error) {
            message = flash.error;
            type = 'error';
        } else if (flash?.success) {
            message = flash.success;
            type = 'success';
        } else if (status) {
            message = status;
            type = 'success';
        }

        if (message) {
            setFlashContent({ type, message });
            setShowFlash(true);
            const timer = setTimeout(() => setShowFlash(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [status, flash]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        const fallbackUrl = `/${urlPrefix}/login`;
        const url = safeRoute('futurisme.login.store', fallbackUrl);
        post(url);
    };

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
            <Head title={`${appName} - Login`} />
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

            <div className="hidden lg:block lg:w-[60%] relative bg-slate-900 border-r border-gray-100 dark:border-gray-800 z-0">
                <AuthArtwork appName={appName} />
            </div>
            <div className="w-full lg:w-[40%] flex flex-col justify-center items-center px-6 sm:px-12 lg:px-16 xl:px-24 relative z-10">
                
                <div className="absolute top-6 right-6 z-40">
                    <ThemeToggle /> 
                </div>

                <div className="w-full max-w-[420px]">
                    
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="mb-10 text-center lg:text-left"
                    >
                        <div className="inline-flex items-center justify-center lg:justify-start gap-4 mb-8">
                            {siteLogo && siteLogo !== 'default_logo' ? (
                                <motion.img 
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    src={siteLogo} 
                                    alt={appName} 
                                    className="h-14 w-auto object-contain"
                                />
                            ) : (
                                <div 
                                    className="h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 transition-transform hover:scale-105 hover:rotate-3"
                                    style={{ backgroundColor: primaryColor }}
                                >
                                     <LogoDefault textClassName="hidden" iconClassName="w-7 h-7" />
                                </div>
                            )}
                            
                            <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight leading-none">
                                {appName}
                            </span>
                        </div>
                        
                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3">
                            Welcome Back
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                            Please enter your credentials to continue to your dashboard.
                        </p>
                    </motion.div>

                    {/* Form Section */}
                    <motion.form 
                        onSubmit={submit} 
                        className="space-y-6"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="space-y-5">
                            <div>
                                <InputLabel htmlFor="email" value="Email Address" className="mb-2 text-gray-700 dark:text-gray-300 font-semibold text-xs uppercase tracking-wider" />
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Icon icon="solar:letter-linear" className="text-gray-400 dark:text-gray-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors w-5 h-5" />
                                    </div>
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="pl-12 py-3.5 w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white font-medium focus:ring-4 focus:ring-opacity-10 transition-all shadow-sm"
                                        style={dynamicRingStyle}
                                        autoComplete="username"
                                        isFocused={true}
                                        placeholder="name@company.com"
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                </div>
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <InputLabel htmlFor="password" value="Password" className="text-gray-700 dark:text-gray-300 font-semibold text-xs uppercase tracking-wider" />
                                </div>
                                
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Icon icon="solar:lock-password-linear" className="text-gray-400 dark:text-gray-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors w-5 h-5" />
                                    </div>
                                    <TextInput
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="pl-12 py-3.5 w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white font-medium focus:ring-4 focus:ring-opacity-10 transition-all shadow-sm"
                                        style={dynamicRingStyle}
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        onChange={(e) => setData('password', e.target.value)}
                                    />
                                </div>
                                <InputError message={errors.password} className="mt-2" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <label className="flex items-center cursor-pointer group select-none">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                                />
                                <span className="ml-2.5 text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">Keep me signed in</span>
                            </label>

                            {canResetPassword && (
                                <a
                                    href={safeRoute('futurisme.password.request', `/${urlPrefix}/forgot-password`)}
                                    className="text-sm font-semibold hover:underline transition-all opacity-90 hover:opacity-100"
                                    style={dynamicTextStyle}
                                >
                                    Forgot password?
                                </a>
                            )}
                        </div>
                        <PrimaryButton 
                            className="w-full justify-center py-4 rounded-xl text-white shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-1 hover:shadow-xl font-bold text-[15px] tracking-wide" 
                            disabled={processing}
                            style={dynamicPrimaryStyle}
                        >
                            {processing ? (
                                <span className="flex items-center gap-2">
                                    <Icon icon="svg-spinners:90-ring-with-bg" className="w-5 h-5" />
                                    Authenticating...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Sign In Account
                                    <Icon icon="solar:arrow-right-linear" className="w-5 h-5" />
                                </span>
                            )}
                        </PrimaryButton>
                    </motion.form>
                    {canRegister && (
                         <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="mt-10 text-center"
                        >
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Don't have an account yet?
                            </p>
                            <a 
                                href={safeRoute('futurisme.register', `/${urlPrefix}/register`)}
                                className="mt-2 inline-flex items-center gap-1 font-bold text-base hover:underline transition-colors"
                                style={dynamicTextStyle}
                            >
                                Create an account
                                <Icon icon="solar:alt-arrow-right-linear" className="w-4 h-4" />
                            </a>
                        </motion.div>
                    )}
                    
                    <div className="mt-12 pt-6 border-t border-gray-100 dark:border-gray-800/50">
                        <p className="text-xs text-center text-gray-400 dark:text-gray-600 font-medium">
                            &copy; {new Date().getFullYear()} {appName}. Secured & Encrypted.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}