import { ReactNode } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import styles from './Layout.module.css';

interface Props {
    children: ReactNode;
    header?: string;
}

// Helper SUPER AMAN untuk route (Copy dari Login.tsx / bisa dibuat utils terpisah)
const safeRoute = (name: string, fallbackUrl: string): string => {
    try {
        // @ts-ignore
        // Cek dulu apakah fungsi route ada
        if (typeof window.route !== 'function') {
            return fallbackUrl;
        }

        // @ts-ignore
        // PENTING: Jangan terlalu agresif mengecek window.Ziggy === undefined di sini
        // karena library route() ziggy-js mungkin bisa bekerja tanpanya di beberapa setup bundler
        
        // Langsung coba panggil route()
        // @ts-ignore
        const r: any = window.route();

        // Jika rute ada di daftar, kembalikan URL-nya
        if (r && typeof r.has === 'function' && r.has(name)) {
             // @ts-ignore
             return window.route(name);
        }
    } catch (e) {
        // Silent fail - jangan spam console
    }
    return fallbackUrl;
};

// Helper untuk mengecek active route dengan aman
const isRouteActive = (name: string): boolean => {
    try {
        // @ts-ignore
        if (typeof window.route === 'function') {
             // @ts-ignore
             const r: any = window.route();
             if (r && typeof r.current === 'function') {
                 return r.current(name);
             }
        }
    } catch (e) { return false; }
    return false;
};

export default function AuthenticatedLayout({ children, header }: Props) {
    // Mengambil data user dari props Inertia
    const { auth } = usePage().props as any;

    const handleLogout = () => {
        // Gunakan fallback URL manual '/admin/logout'
        router.post(safeRoute('futurisme.logout', '/admin/logout'));
    };

    return (
        <div className={styles.wrapper}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.brand}>
                    <span>Futurisme</span>
                </div>
                <nav className="fa-mt-6 fa-flex-1">
                    <Link
                        // Fallback ke '/admin' jika route tidak ditemukan
                        href={safeRoute('futurisme.dashboard', '/admin')}
                        className={`${styles.navLink} ${isRouteActive('futurisme.dashboard') ? styles.navLinkActive : ''}`}
                    >
                        Dashboard
                    </Link>
                    {/* Placeholder Menu Lain */}
                    <Link href="#" className={styles.navLink}>
                        Settings
                    </Link>
                    <Link href="#" className={styles.navLink}>
                        Users
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
                {/* Header / Topbar */}
                <header className={styles.header}>
                    <h2 className="fa-font-semibold fa-text-xl fa-text-gray-800 fa-leading-tight">
                        {header || 'Dashboard'}
                    </h2>

                    <div className="fa-flex fa-items-center fa-gap-4">
                        <span className="fa-text-sm fa-text-gray-600">
                            Halo, {auth?.user?.name || 'Admin'}
                        </span>
                        <button onClick={handleLogout} className={styles.logoutBtn}>
                            Logout
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <div className={styles.contentBody}>
                    {children}
                </div>
            </main>
        </div>
    );
}