import { useEffect, FormEventHandler } from 'react';
import { Head, useForm } from '@inertiajs/react';
import Checkbox from '../../Components/Checkbox';
import InputError from '../../Components/InputError';
import InputLabel from '../../Components/InputLabel';
import PrimaryButton from '../../Components/PrimaryButton';
import TextInput from '../../Components/TextInput';
import styles from './Login.module.css'; 

// Helper SUPER AMAN untuk route
const safeRoute = (name: string, fallbackUrl: string): string => {
    try {
        // @ts-ignore
        if (typeof window.route !== 'function' || typeof window.Ziggy === 'undefined') {
            // Silent fallback jika environment belum siap
            return fallbackUrl;
        }

        // @ts-ignore
        const r: any = window.route();

        if (r && typeof r.has === 'function') {
            if (r.has(name)) {
                // @ts-ignore
                return window.route(name);
            } else {
                // PENTING: Jangan spam console error jika route memang belum ada (misal fitur dimatikan)
                // Cukup return fallback
                // console.warn(`[Futurisme] Route '${name}' missing. Using fallback: ${fallbackUrl}`);
                return fallbackUrl;
            }
        }
    } catch (e) {
        // Silent fail
    }

    return fallbackUrl;
};

export default function Login({ status, canResetPassword }: { status?: string, canResetPassword?: boolean }) {
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
        
        // Gunakan fallback manual '/admin/login' yang pasti benar untuk form login standar
        const url = safeRoute('futurisme.login.store', '/admin/login');
        post(url);
    };

    return (
        <div className={styles.loginContainer}>
            <Head title="Admin Login" />

            <div className="fa-text-center fa-mb-2">
                <div className={styles.brandContainer}>
                    <svg className="fa-w-8 fa-h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                    </svg>
                </div>
                <h2 className="fa-text-3xl fa-font-extrabold fa-text-gray-900 fa-tracking-tight">
                    Futurisme Admin
                </h2>
                <p className="fa-mt-2 fa-text-sm fa-text-gray-500">
                    Selamat datang kembali, silakan masuk ke akun Anda.
                </p>
            </div>

            {status && (
                <div className="fa-w-full fa-max-w-md fa-mb-4 fa-p-4 fa-bg-green-50 fa-border-l-4 fa-border-green-500 fa-rounded-r-md fa-shadow-sm fa-animate-bounce">
                    <div className="fa-flex">
                        <div className="fa-flex-shrink-0">
                            <svg className="fa-h-5 fa-w-5 fa-text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="fa-ml-3">
                            <p className="fa-text-sm fa-text-green-700">{status}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.loginCard}>
                <form onSubmit={submit} className="fa-space-y-6">
                    <div>
                        <InputLabel htmlFor="email" value="Email Address" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="fa-mt-1"
                            autoComplete="username"
                            isFocused={true}
                            placeholder="nama@perusahaan.com"
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <InputError message={errors.email} className="fa-mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="password" value="Password" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="fa-mt-1"
                            autoComplete="current-password"
                            placeholder="••••••••"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <InputError message={errors.password} className="fa-mt-2" />
                    </div>

                    <div className="fa-flex fa-items-center fa-justify-between">
                        <label className="fa-flex fa-items-center fa-cursor-pointer">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                            />
                            <span className="fa-ml-2 fa-text-sm fa-text-gray-600 hover:fa-text-gray-900">Ingat saya</span>
                        </label>

                        {canResetPassword && (
                            <a
                                href={safeRoute('futurisme.password.request', '#')}
                                className="fa-text-sm fa-font-medium fa-text-indigo-600 hover:fa-text-indigo-500 fa-transition-colors"
                            >
                                Lupa password?
                            </a>
                        )}
                    </div>

                    <div>
                        <PrimaryButton className="fa-w-full fa-justify-center" disabled={processing}>
                            {processing ? (
                                <span className="fa-flex fa-items-center">
                                    <svg className="fa-animate-spin -fa-ml-1 fa-mr-3 fa-h-4 fa-w-4 fa-text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="fa-opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="fa-opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Memproses...
                                </span>
                            ) : (
                                'Masuk ke Dashboard'
                            )}
                        </PrimaryButton>
                    </div>
                </form>
            </div>

            <div className="fa-mt-8 fa-text-center">
                <p className="fa-text-xs fa-text-gray-400">
                    &copy; {new Date().getFullYear()} Futurisme Admin. Secured & Encrypted.
                </p>
            </div>
        </div>
    );
}