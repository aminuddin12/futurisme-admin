import { ReactNode } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import styles from './Layout.module.css';

interface Props {
    children: ReactNode;
    header?: string;
}

export default function AuthenticatedLayout({ children, header }: Props) {
    // Mengambil data user dari props Inertia (pastikan Middleware HandleInertiaRequests mengirim ini)
    const { auth } = usePage().props as any;

    const handleLogout = () => {
        router.post(route('futurisme.logout'));
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
                        href={route('futurisme.dashboard')}
                        className={`${styles.navLink} ${route().current('futurisme.dashboard') ? styles.navLinkActive : ''}`}
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
