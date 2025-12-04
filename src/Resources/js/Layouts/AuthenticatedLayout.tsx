import { ReactNode } from 'react';
import { usePage } from '@inertiajs/react';
import styles from './Layout.module.css';
import Sidebar from '../Components/Sidebar/Sidebar';
import Header from '../Components/Header/Header'; // Import Header Baru

interface Props {
    children: ReactNode;
    header?: string;
}

export default function AuthenticatedLayout({ children, header }: Props) {
    // Mengambil data menu dari props Inertia (Middleware)
    const { menus } = usePage().props as any;
    
    return (
        <div className={styles.wrapper}>
            {/* Sidebar Component */}
            <Sidebar menus={menus || []} />

            {/* Main Content Wrapper */}
            <div className={styles.mainContent}>
                
                {/* Header Component (Search & Topbar) */}
                <Header headerTitle={header} />

                {/* Page Content Body */}
                <main className={styles.contentBody}>
                    {children}
                </main>
            </div>
        </div>
    );
}