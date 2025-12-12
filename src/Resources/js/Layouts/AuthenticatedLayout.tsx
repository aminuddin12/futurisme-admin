import { useState, useEffect, ReactNode } from 'react';
import { usePage } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar/Sidebar';
import Header from '@/Components/Header/Header';
import FlashMessage from '@/Components/Message/FlashMessage';
import CookieConsent from '@/Components/System/CookieConsent';

interface AuthenticatedProps {
    header?: string;
    children: ReactNode;
}

export default function AuthenticatedLayout({ header, children }: AuthenticatedProps) {
    const { flash } = usePage().props as any;
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [showFlash, setShowFlash] = useState(true);

    useEffect(() => {
        if (flash.success || flash.error || flash.warning) {
            setShowFlash(true);
            const timer = setTimeout(() => setShowFlash(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            {showFlash && (flash.success || flash.error || flash.warning) && (
                <div className="fixed top-24 right-6 z-50">
                    <FlashMessage 
                        type={flash.error ? 'error' : flash.warning ? 'warning' : 'success'}
                        message={flash.error || flash.success || flash.warning} 
                        onClose={() => setShowFlash(false)}
                    />
                </div>
            )}

            <Sidebar 
                isCollapsed={isSidebarCollapsed}
                onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            /> 

            <div 
                className={`
                    flex flex-col min-h-screen transition-all duration-300 ease-in-out
                    ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-[280px]'}
                `}
            >
                <Header 
                    headerTitle={header} 
                    onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
                />
                
                <main className="flex-1 px-4 p-4 mt-4 overflow-x-hidden">
                    {children}
                </main>
                
                <footer className="px-6 py-4 text-center text-xs text-gray-400 dark:text-gray-600">
                    &copy; {new Date().getFullYear()} Futurisme Admin. All rights reserved.
                </footer>
            </div>
            
            <CookieConsent />
        </div>
    );
}