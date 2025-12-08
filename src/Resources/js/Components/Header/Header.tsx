import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import SearchDialog from './SearchDialog';
import ThemeToggle from '../Theme/ThemeToggle'; 

interface HeaderProps {
    headerTitle?: string;
    onToggleSidebar: () => void;
}

export default function Header({ headerTitle, onToggleSidebar }: HeaderProps) {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchOpen(true);
            }
            if (e.key === 'Escape') {
                setIsSearchOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <>
            <header className="h-20 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800/50 flex items-center justify-between px-6 sticky top-0 z-30 transition-colors duration-300">

                <div className="flex items-center gap-4">
                    <button 
                        onClick={onToggleSidebar}
                        className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-xl transition-colors focus:outline-none"
                        aria-label="Open Menu"
                    >
                        <Icon icon="solar:hamburger-menu-linear" width="24" height="24" />
                    </button>

                    <h2 className="font-bold text-xl text-gray-900 dark:text-white leading-tight tracking-tight">
                        {headerTitle || 'Dashboard'}
                    </h2>
                </div>
                <div className="flex items-center gap-3 sm:gap-4">
                    <button 
                        onClick={() => setIsSearchOpen(true)}
                        className="hidden sm:flex items-center gap-3 px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700/50 rounded-xl text-sm text-gray-500 hover:border-indigo-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all group w-48 lg:w-64"
                    >
                        <Icon icon="solar:magnifer-linear" className="w-4.5 h-4.5 group-hover:text-indigo-500 transition-colors" />
                        <span className="flex-1 text-left truncate">Search...</span>
                        <div className="flex items-center gap-1">
                            <kbd className="hidden lg:inline-block font-sans text-[10px] font-bold px-1.5 py-0.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-400 rounded-md shadow-sm">
                                ⌘K
                            </kbd>
                        </div>
                    </button>
                    <button 
                        onClick={() => setIsSearchOpen(true)}
                        className="sm:hidden p-2.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                    >
                        <Icon icon="solar:magnifer-linear" width="22" height="22" />
                    </button>

                    <ThemeToggle />
                    <button className="p-2.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:text-gray-400 dark:hover:bg-gray-800 rounded-xl relative transition-colors">
                        <Icon icon="solar:bell-bing-linear" width="22" height="22" />
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-gray-950"></span>
                    </button>

                    <div className="h-8 w-px bg-gray-200 dark:bg-gray-800 mx-1 hidden sm:block"></div>

                    <button className="hidden sm:block p-2.5 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-xl transition-colors">
                        <Icon icon="solar:question-circle-linear" width="22" height="22" />
                    </button>

                </div>
            </header>

            {/* Global Search Dialog */}
            <SearchDialog isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}