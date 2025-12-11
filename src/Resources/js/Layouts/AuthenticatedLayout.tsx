import { useState, PropsWithChildren, ReactNode } from 'react';
import { Head, usePage } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar/Sidebar';
import Header from '@/Components/Header/Header';
import FlashMessage from '@/Components/Message/FlashMessage';

interface AuthenticatedProps {
    header?: string;
    children: ReactNode;
}

export default function AuthenticatedLayout({ header, children }: AuthenticatedProps) {
    const { flash } = usePage().props as any;

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            {flash && (flash.success || flash.error) && (
                <div className="fixed top-24 right-6 z-50">
                    <FlashMessage 
                        type={flash.error ? 'error' : 'success'}
                        message={flash.error || flash.success} onClose={function (): void {
                            throw new Error('Function not implemented.');
                        } }                    />
                </div>
            )}
            <Sidebar 
                isCollapsed={isSidebarCollapsed}
                onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            /> 

            <div 
                className={`
                    flex flex-col min-h-screen transition-all duration-300 ease-in-out
                    ${isSidebarCollapsed ? 'lg:ml-[80px]' : 'lg:ml-[280px]'}
                `}
            >
                <Header 
                    headerTitle={header} 
                    onToggleSidebar={() => {
                        window.dispatchEvent(new CustomEvent('open-mobile-sidebar'));
                    }} 
                />
                <main className="flex-1 p-6">
                    {children}
                </main>
                <footer className="px-6 py-4 text-center text-xs text-gray-400 dark:text-gray-600">
                    &copy; {new Date().getFullYear()} Futurisme Admin. All rights reserved.
                </footer>
            </div>
        </div>
    );
}