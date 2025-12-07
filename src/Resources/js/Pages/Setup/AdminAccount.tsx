import { useState, useEffect } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import FaPublicLayout from '../../Layouts/FaPublicLayout';
import TextInput from '../../Components/TextInput';
import InputLabel from '../../Components/InputLabel';
import InputError from '../../Components/InputError';
import PrimaryButton from '../../Components/PrimaryButton';
import InstallationArtwork from './InstallationArtwork';
import FlashMessage, { FlashType } from '../../Components/Message/FlashMessage';
import { safeRoute } from '../../Utils/routeHelper';

export default function AdminAccount() {
    // Hooks Inertia
    const { flash, errors: pageErrors } = usePage<any>().props;

    // --- STATES ---
    const [flashMsg, setFlashMsg] = useState<{ msg: string | null, type: FlashType }>({ msg: null, type: 'success' });

    // Handle Flash Messages & Errors
    useEffect(() => {
        if (flash?.status) {
            setFlashMsg({ msg: flash.status, type: 'success' });
        } else if (flash?.error) {
            setFlashMsg({ msg: flash.error, type: 'error' });
        } else if (Object.keys(pageErrors).length > 0) {
            const firstError = Object.values(pageErrors)[0];
            setFlashMsg({ msg: firstError as string, type: 'error' });
        }
    }, [flash, pageErrors]);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(safeRoute('futurisme.setup.admin.store', '/fu-settings/admin/save'), {
            onFinish: () => {
                // reset('password', 'password_confirmation') // Optional: reset password fields
            },
            onError: (err) => {
                console.error("Submission error:", err);
                setFlashMsg({ msg: "Failed to create admin account. Please check the form.", type: 'error' });
            }
        });
    };

    return (
        <FaPublicLayout title="Create Admin Account" maxWidth="max-w-full">
            {/* Flash Message Component */}
            <FlashMessage 
                message={flashMsg.msg} 
                type={flashMsg.type} 
                onClose={() => setFlashMsg({ ...flashMsg, msg: null })} 
            />

            <div className="flex flex-col lg:flex-row h-screen bg-white dark:bg-slate-900 overflow-hidden fixed inset-0">
                
                {/* Left Panel: Artwork (60% Width on Desktop) */}
                <div className="hidden lg:block lg:w-3/5 relative bg-slate-900 h-full border-r border-slate-800">
                    <div className="h-full w-full relative z-10">
                        <InstallationArtwork />
                    </div>
                </div>

                {/* Right Panel: Form Content (40% Width on Desktop) */}
                <div className="w-full lg:w-2/5 flex flex-col h-full bg-slate-50 dark:bg-slate-950 relative">
                    
                    {/* Header: Fixed */}
                    <div className="px-6 py-6 md:px-10 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-30 shadow-sm flex justify-between items-center shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400">
                                <Icon icon="solar:shield-user-bold-duotone" width="28" height="28" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">
                                    Admin Account
                                </h1>
                                <p className="text-slate-500 dark:text-slate-400 text-xs">
                                    Create your super admin credentials.
                                </p>
                            </div>
                        </div>
                        {/* Step Indicator */}
                        <div className="hidden sm:block">
                             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800">
                                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Step 2 of 2</span>
                             </div>
                        </div>
                    </div>

                    {/* Scrollable Form Area */}
                    <div className="flex-1 h-full overflow-y-auto custom-scrollbar p-6 md:p-10 flex flex-col justify-center">
                        <div className="max-w-md mx-auto w-full space-y-8">
                            
                            <div className="text-center lg:text-left space-y-2 mb-8">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                    Welcome, Commander! 👋
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">
                                    Let's set up your primary access. This account will have <span className="text-indigo-500 font-medium">Super Admin</span> privileges.
                                </p>
                            </div>

                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="name" value="Full Name" className="mb-2" />
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                            <Icon icon="solar:user-circle-bold" width="20" />
                                        </div>
                                        <TextInput
                                            id="name"
                                            name="name"
                                            value={data.name}
                                            className="w-full pl-10"
                                            autoComplete="name"
                                            isFocused={true}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="e.g. John Doe"
                                            required
                                        />
                                    </div>
                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="email" value="Email Address" className="mb-2" />
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                            <Icon icon="solar:letter-bold" width="20" />
                                        </div>
                                        <TextInput
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            className="w-full pl-10"
                                            autoComplete="username"
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="name@company.com"
                                            required
                                        />
                                    </div>
                                    <InputError message={errors.email} className="mt-2" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="password" value="Password" className="mb-2" />
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                                <Icon icon="solar:lock-password-bold" width="20" />
                                            </div>
                                            <TextInput
                                                id="password"
                                                type="password"
                                                name="password"
                                                value={data.password}
                                                className="w-full pl-10"
                                                autoComplete="new-password"
                                                onChange={(e) => setData('password', e.target.value)}
                                                placeholder="••••••••"
                                                required
                                            />
                                        </div>
                                        <InputError message={errors.password} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="password_confirmation" value="Confirm Password" className="mb-2" />
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                                <Icon icon="solar:lock-password-bold" width="20" />
                                            </div>
                                            <TextInput
                                                id="password_confirmation"
                                                type="password"
                                                name="password_confirmation"
                                                value={data.password_confirmation}
                                                className="w-full pl-10"
                                                autoComplete="new-password"
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                placeholder="••••••••"
                                                required
                                            />
                                        </div>
                                        <InputError message={errors.password_confirmation} className="mt-2" />
                                    </div>
                                </div>

                                {/* Security Notice */}
                                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30 rounded-xl flex items-start gap-3">
                                    <Icon icon="solar:shield-warning-bold" className="text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" />
                                    <div className="text-xs text-yellow-700 dark:text-yellow-400 leading-relaxed">
                                        Ensure you use a strong password. This account has unrestricted access to all system modules and configurations.
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Footer Actions: Fixed at Bottom */}
                    <div className="bg-white/80 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-4 md:px-10 z-30 shrink-0">
                        <div className="flex flex-col-reverse sm:flex-row justify-between items-center max-w-full gap-4">
                            <div className="text-xs text-slate-400 text-center sm:text-left">
                                © {new Date().getFullYear()} Futurisme Admin. All rights reserved.
                            </div>
                            <div className="w-full sm:w-auto">
                                <PrimaryButton 
                                    onClick={submit}
                                    disabled={processing} 
                                    className="w-full sm:w-auto px-8 py-3 text-sm shadow-xl shadow-indigo-500/20 justify-center rounded-xl"
                                >
                                    {processing ? (
                                        <div className="flex items-center gap-2">
                                            <Icon icon="svg-spinners:ring-resize" /> Creating Account...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Icon icon="solar:user-plus-bold" /> Create & Login
                                        </div>
                                    )}
                                </PrimaryButton>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </FaPublicLayout>
    );
}