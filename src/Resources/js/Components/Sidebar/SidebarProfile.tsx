import { Icon } from '@iconify/react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, router } from '@inertiajs/react';
import { safeRoute } from '../../Utils/routeHelper';

interface SidebarProfileProps {
    isCollapsed: boolean;
    name?: string;
    email?: string;
    avatarUrl?: string | null;
}

export default function SidebarProfile({ 
    isCollapsed, 
    name = 'User', 
    email = 'user@example.com',
    avatarUrl = null
}: SidebarProfileProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        router.post(safeRoute('futurisme.logout', '/admin/logout'));
    };

    // Menu Items Config
    const menuItems = [
        { label: 'My Profile', icon: 'heroicons:user', action: () => router.visit(safeRoute('futurisme.profile', '#')) },
        { label: 'Security', icon: 'heroicons:shield-check', action: () => router.visit(safeRoute('futurisme.security', '#')) },
        { label: 'Settings', icon: 'heroicons:cog-6-tooth', action: () => router.visit(safeRoute('futurisme.settings', '#')) },
        { type: 'divider' },
        { label: 'Logout', icon: 'heroicons:arrow-right-on-rectangle', action: handleLogout, danger: true },
    ];

    return (
        <div ref={menuRef} className={`fa-relative fa-border-t fa-border-slate-200 dark:fa-border-slate-800 fa-bg-[#F7F8FA] dark:fa-bg-slate-900 ${isCollapsed ? 'fa-p-2' : 'fa-p-4'}`}>
            
            {/* Popover Menu with AnimatePresence */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className={`
                            fa-absolute fa-z-50 fa-mb-2
                            /* Logika Posisi: 
                               Jika Collapsed: Muncul di SAMPING KANAN (left-full) dan sedikit ke atas. 
                               Jika Full: Muncul DI ATAS (bottom-full) selebar sidebar.
                            */
                            ${isCollapsed 
                                ? 'fa-left-full fa-bottom-0 fa-ml-3 fa-w-56' 
                                : 'fa-bottom-full fa-left-0 fa-w-full fa-px-4'
                            }
                        `}
                    >
                        <div className={`
                            fa-bg-white dark:fa-bg-slate-800 fa-rounded-xl fa-shadow-xl fa-border fa-border-slate-200 dark:fa-border-slate-700 fa-overflow-hidden fa-py-1
                        `}>
                            {/* Header di dalam menu (hanya muncul saat collapsed untuk konteks) */}
                            {isCollapsed && (
                                <div className="fa-px-4 fa-py-3 fa-border-b fa-border-slate-100 dark:fa-border-slate-700 fa-bg-slate-50 dark:fa-bg-slate-800/50">
                                    <p className="fa-text-sm fa-font-bold fa-text-slate-900 dark:fa-text-white fa-truncate">{name}</p>
                                    <p className="fa-text-xs fa-text-slate-500 fa-truncate">{email}</p>
                                </div>
                            )}

                            {menuItems.map((item, index) => {
                                if (item.type === 'divider') {
                                    return <div key={index} className="fa-my-1 fa-border-t fa-border-slate-100 dark:fa-border-slate-700"></div>;
                                }
                                return (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            item.action && item.action();
                                            setIsOpen(false);
                                        }}
                                        className={`
                                            fa-w-full fa-flex fa-items-center fa-gap-3 fa-px-4 fa-py-2.5 fa-text-sm fa-transition-colors
                                            ${item.danger 
                                                ? 'fa-text-red-600 hover:fa-bg-red-50 dark:hover:fa-bg-red-900/20' 
                                                : 'fa-text-slate-600 dark:fa-text-slate-300 hover:fa-text-slate-900 hover:fa-bg-slate-50 dark:hover:fa-bg-slate-700/50'}
                                        `}
                                    >
                                        {item.icon && <Icon icon={item.icon} className={`fa-w-4.5 fa-h-4.5 ${item.danger ? '' : 'fa-text-slate-400'}`} />}
                                        <span className="fa-font-medium">{item.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Trigger Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    fa-w-full fa-flex fa-items-center fa-cursor-pointer fa-group fa-p-2 fa-rounded-xl fa-transition-all fa-border fa-border-transparent
                    hover:fa-bg-white dark:hover:fa-bg-slate-800 hover:fa-shadow-sm hover:fa-border-slate-200 dark:hover:fa-border-slate-700
                    ${isOpen ? 'fa-bg-white dark:fa-bg-slate-800 fa-shadow-sm fa-border-slate-200 dark:fa-border-slate-700' : ''}
                    ${isCollapsed ? 'fa-justify-center' : 'fa-gap-3'}
                `}
            >
                {/* Avatar */}
                {avatarUrl ? (
                    <img 
                        src={avatarUrl} 
                        alt={name} 
                        className="fa-w-9 fa-h-9 fa-rounded-full fa-object-cover fa-border fa-border-white dark:fa-border-slate-700 fa-shadow-sm"
                    />
                ) : (
                    <img 
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff`}
                        alt={name} 
                        className="fa-w-9 fa-h-9 fa-rounded-full fa-object-cover fa-border fa-border-white dark:fa-border-slate-700 fa-shadow-sm"
                    />
                )}

                {/* Text Info (Hidden when collapsed) */}
                {!isCollapsed && (
                    <>
                        <div className="fa-flex-1 fa-min-w-0 fa-text-left">
                            <p className="fa-text-sm fa-font-bold fa-text-slate-900 dark:fa-text-white fa-truncate group-hover:fa-text-indigo-600 dark:group-hover:fa-text-indigo-400 fa-transition-colors">
                                {name}
                            </p>
                            <p className="fa-text-xs fa-text-slate-500 dark:fa-text-slate-400 fa-truncate">
                                {email}
                            </p>
                        </div>
                        <Icon 
                            icon="heroicons:chevron-up-down" 
                            className={`fa-w-4 fa-h-4 fa-text-slate-400 group-hover:fa-text-slate-600 fa-transition-transform ${isOpen ? 'fa-rotate-180' : ''}`} 
                        />
                    </>
                )}
            </button>
        </div>
    );
}