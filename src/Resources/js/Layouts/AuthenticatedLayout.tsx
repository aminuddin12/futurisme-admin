import { ReactNode } from 'react';
import { usePage, router } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import styles from './Layout.module.css';
import Sidebar from '../Components/Sidebar/Sidebar'; // Import Sidebar Baru
import { safeRoute } from '../Utils/routeHelper';

interface Props {
    children: ReactNode;
    header?: string;
}

export default function AuthenticatedLayout({ children, header }: Props) {
    // Ambil data user, config, dan menus (dari middleware) dari props Inertia
    const { auth, config, menus } = usePage().props as any;
    
    const urlPrefix = config?.url_prefix || 'admin';

    const handleLogout = () => {
        router.post(safeRoute('futurisme.logout', `/${urlPrefix}/logout`));
    };

    return (
        <div className={styles.wrapper}>
            {/* Sidebar Component (Dinamis & Modular) */}
            <Sidebar menus={menus || []} />

            {/* Main Content */}
            <main className={styles.mainContent}>
                {/* Header / Topbar */}
                <header className={styles.header}>
                    <div className="fa-flex fa-items-center">
                        <h2 className="fa-font-semibold fa-text-xl fa-text-gray-800 fa-leading-tight">
                            {header || 'Dashboard'}
                        </h2>
                    </div>

                    <div className="fa-flex fa-items-center fa-gap-4">
                        <div className="fa-text-right fa-mr-2 fa-hidden sm:fa-block">
                            <div className="fa-text-sm fa-font-medium fa-text-gray-900">
                                {auth?.user?.name || 'Admin'}
                            </div>
                            <div className="fa-text-xs fa-text-gray-500">
                                {auth?.user?.email}
                            </div>
                        </div>
                        
                        <button 
                            onClick={handleLogout} 
                            className="fa-p-2 fa-text-gray-400 hover:fa-text-red-500 fa-transition-colors fa-rounded-full hover:fa-bg-gray-100"
                            title="Logout"
                        >
                            <Icon icon="heroicons:arrow-right-on-rectangle" className="fa-h-6 fa-w-6" />
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