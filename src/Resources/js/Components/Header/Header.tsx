import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import SearchDialog from './SearchDialog';
import ThemeToggle from '../Theme/ThemeToggle'; // Import ThemeToggle

interface HeaderProps {
    headerTitle?: string;
}

export default function Header({ headerTitle }: HeaderProps) {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // Shortcut Search (Ctrl/Cmd + K)
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
            <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-30 transition-colors duration-300">
                
                {/* Left: Title */}
                <div className="flex items-center gap-4">
                    <button className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <Icon icon="heroicons:bars-3" width="24" height="24" />
                    </button>

                    <h2 className="font-semibold text-lg text-slate-800 dark:text-white leading-tight">
                        {headerTitle || 'Dashboard'}
                    </h2>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3 sm:gap-4">
                    
                    {/* Search Trigger */}
                    <button 
                        onClick={() => setIsSearchOpen(true)}
                        className="hidden sm:flex items-center gap-3 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-500 hover:border-indigo-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all group w-48 lg:w-64"
                    >
                        <Icon icon="heroicons:magnifying-glass" className="w-4 h-4 group-hover:text-indigo-500" />
                        <span className="flex-1 text-left">Search...</span>
                        <div className="flex items-center gap-1">
                            <kbd className="hidden lg:inline-block font-sans text-[10px] font-bold px-1.5 py-0.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-400 rounded">
                                ⌘K
                            </kbd>
                        </div>
                    </button>

                    {/* Mobile Search Icon */}
                    <button 
                        onClick={() => setIsSearchOpen(true)}
                        className="sm:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                    >
                        <Icon icon="heroicons:magnifying-glass" width="20" height="20" />
                    </button>

                    {/* Theme Toggle Component */}
                    <ThemeToggle />

                    {/* Notification Bell */}
                    <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full relative transition-colors">
                        <Icon icon="heroicons:bell" width="20" height="20" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                    </button>

                    {/* Divider */}
                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

                    {/* Help Button */}
                    <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <Icon icon="heroicons:question-mark-circle" width="20" height="20" />
                    </button>

                </div>
            </header>

            {/* Global Search Dialog */}
            <SearchDialog isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}