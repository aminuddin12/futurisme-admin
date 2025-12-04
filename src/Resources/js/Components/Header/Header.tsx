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
            <header className="fa-h-16 fa-bg-white dark:fa-bg-slate-900 fa-border-b fa-border-slate-200 dark:fa-border-slate-800 fa-flex fa-items-center fa-justify-between fa-px-6 fa-sticky fa-top-0 fa-z-30 fa-transition-colors fa-duration-300">
                
                {/* Left: Title */}
                <div className="fa-flex fa-items-center fa-gap-4">
                    <button className="lg:fa-hidden fa-p-2 fa-text-slate-500 hover:fa-bg-slate-100 dark:hover:fa-bg-slate-800 fa-rounded-lg fa-transition-colors">
                        <Icon icon="heroicons:bars-3" width="24" height="24" />
                    </button>

                    <h2 className="fa-font-semibold fa-text-lg fa-text-slate-800 dark:fa-text-white fa-leading-tight">
                        {headerTitle || 'Dashboard'}
                    </h2>
                </div>

                {/* Right: Actions */}
                <div className="fa-flex fa-items-center fa-gap-3 sm:fa-gap-4">
                    
                    {/* Search Trigger */}
                    <button 
                        onClick={() => setIsSearchOpen(true)}
                        className="fa-hidden sm:fa-flex fa-items-center fa-gap-3 fa-px-3 fa-py-1.5 fa-bg-slate-50 dark:fa-bg-slate-800 fa-border fa-border-slate-200 dark:fa-border-slate-700 fa-rounded-lg fa-text-sm fa-text-slate-500 hover:fa-border-indigo-300 hover:fa-text-indigo-600 dark:hover:fa-text-indigo-400 fa-transition-all fa-group fa-w-48 lg:fa-w-64"
                    >
                        <Icon icon="heroicons:magnifying-glass" className="fa-w-4 fa-h-4 group-hover:fa-text-indigo-500" />
                        <span className="fa-flex-1 fa-text-left">Search...</span>
                        <div className="fa-flex fa-items-center fa-gap-1">
                            <kbd className="fa-hidden lg:fa-inline-block fa-font-sans fa-text-[10px] fa-font-bold fa-px-1.5 fa-py-0.5 fa-bg-white dark:fa-bg-slate-700 fa-border fa-border-slate-200 dark:fa-border-slate-600 fa-text-slate-400 fa-rounded">
                                ⌘K
                            </kbd>
                        </div>
                    </button>

                    {/* Mobile Search Icon */}
                    <button 
                        onClick={() => setIsSearchOpen(true)}
                        className="sm:fa-hidden fa-p-2 fa-text-slate-500 hover:fa-bg-slate-100 dark:fa-hover:bg-slate-800 fa-rounded-full fa-transition-colors"
                    >
                        <Icon icon="heroicons:magnifying-glass" width="20" height="20" />
                    </button>

                    {/* Theme Toggle Component */}
                    <ThemeToggle />

                    {/* Notification Bell */}
                    <button className="fa-p-2 fa-text-slate-500 hover:fa-bg-slate-100 dark:fa-hover:bg-slate-800 fa-rounded-full fa-relative fa-transition-colors">
                        <Icon icon="heroicons:bell" width="20" height="20" />
                        <span className="fa-absolute fa-top-2 fa-right-2 fa-w-2 fa-h-2 fa-bg-red-500 fa-rounded-full fa-border-2 fa-border-white dark:fa-border-slate-900"></span>
                    </button>

                    {/* Divider */}
                    <div className="fa-h-6 fa-w-px fa-bg-slate-200 dark:fa-bg-slate-700 fa-mx-1"></div>

                    {/* Help Button */}
                    <button className="fa-p-2 fa-text-slate-500 hover:fa-bg-slate-100 dark:fa-hover:bg-slate-800 fa-rounded-full fa-transition-colors">
                        <Icon icon="heroicons:question-mark-circle" width="20" height="20" />
                    </button>

                </div>
            </header>

            {/* Global Search Dialog */}
            <SearchDialog isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}