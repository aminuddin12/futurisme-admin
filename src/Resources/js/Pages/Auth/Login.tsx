import { useEffect, FormEventHandler } from 'react';
import { Head, useForm } from '@inertiajs/react';
import styles from './Login.module.css';

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
        post(route('futurisme.login.store'));
    };

    return (
        <div className={styles.loginContainer}>
            <Head title="Admin Login" />

            <div className={`fa-mb-4 fa-text-center`}>
                <h2 className="fa-text-2xl fa-font-bold fa-text-gray-800">Futurisme Admin</h2>
                <p className="fa-text-gray-500 fa-text-sm">Silakan masuk untuk melanjutkan</p>
            </div>

            {status && (
                <div className="fa-mb-4 fa-font-medium fa-text-sm fa-text-green-600">
                    {status}
                </div>
            )}

            <div className={styles.loginCard}>
                <form onSubmit={submit}>
                    <div>
                        <label htmlFor="email" className={styles.inputLabel}>
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className={styles.textInput}
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <span className="fa-text-red-600 fa-text-sm fa-mt-1 fa-block">{errors.email}</span>
                    </div>

                    <div className="fa-mt-4">
                        <label htmlFor="password" className={styles.inputLabel}>
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className={styles.textInput}
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                         <span className="fa-text-red-600 fa-text-sm fa-mt-1 fa-block">{errors.password}</span>
                    </div>

                    <div className="fa-block fa-mt-4">
                        <label className="fa-flex fa-items-center">
                            <input
                                type="checkbox"
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="fa-rounded fa-border-gray-300 fa-text-indigo-600 fa-shadow-sm focus:fa-ring-indigo-500"
                            />
                            <span className="fa-ml-2 fa-text-sm fa-text-gray-600">Ingat Saya</span>
                        </label>
                    </div>

                    <div className="fa-flex fa-items-center fa-justify-end fa-mt-4">
                        {canResetPassword && (
                            <a
                                href={route('futurisme.password.request')}
                                className="fa-underline fa-text-sm fa-text-gray-600 hover:fa-text-gray-900 fa-rounded-md focus:fa-outline-none focus:fa-ring-2 focus:fa-ring-offset-2 focus:fa-ring-indigo-500"
                            >
                                Lupa password?
                            </a>
                        )}

                        <button className={`${styles.primaryButton} fa-ml-4`} disabled={processing}>
                            Log in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
