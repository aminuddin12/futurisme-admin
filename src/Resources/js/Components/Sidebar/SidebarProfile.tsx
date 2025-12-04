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
        <div ref={menuRef} className={`relative border-t border-slate-200 dark:border-slate-800 bg-[#F7F8FA] dark:bg-slate-900 ${isCollapsed ? 'p-2' : 'p-4'}`}>
            
            {/* Popover Menu with AnimatePresence */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className={`
                            absolute z-50 mb-2
                            /* Logika Posisi: 
                               Jika Collapsed: Muncul di SAMPING KANAN (left-full) dan sedikit ke atas. 
                               Jika Full: Muncul DI ATAS (bottom-full) selebar sidebar.
                            */
                            ${isCollapsed 
                                ? 'left-full bottom-0 ml-3 w-56' 
                                : 'bottom-full left-0 w-full px-4'
                            }
                        `}
                    >
                        <div className={`
                            bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden py-1
                        `}>
                            {/* Header di dalam menu (hanya muncul saat collapsed untuk konteks) */}
                            {isCollapsed && (
                                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{name}</p>
                                    <p className="text-xs text-slate-500 truncate">{email}</p>
                                </div>
                            )}

                            {menuItems.map((item, index) => {
                                if (item.type === 'divider') {
                                    return <div key={index} className="my-1 border-t border-slate-100 dark:border-slate-700"></div>;
                                }
                                return (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            item.action && item.action();
                                            setIsOpen(false);
                                        }}
                                        className={`
                                            w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors
                                            ${item.danger 
                                                ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20' 
                                                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-50 dark:hover:bg-slate-700/50'}
                                        `}
                                    >
                                        {item.icon && <Icon icon={item.icon} className={`w-4.5 h-4.5 ${item.danger ? '' : 'text-slate-400'}`} />}
                                        <span className="font-medium">{item.label}</span>
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
                    w-full flex items-center cursor-pointer group p-2 rounded-xl transition-all border border-transparent
                    hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm hover:border-slate-200 dark:hover:border-slate-700
                    ${isOpen ? 'bg-white dark:bg-slate-800 shadow-sm border-slate-200 dark:border-slate-700' : ''}
                    ${isCollapsed ? 'justify-center' : 'gap-3'}
                `}
            >
                {/* Avatar */}
                {avatarUrl ? (
                    <img 
                        src={avatarUrl} 
                        alt={name} 
                        className="w-9 h-9 rounded-full object-cover border border-white dark:border-slate-700 shadow-sm"
                    />
                ) : (
                    <img 
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'U')}&background=0D8ABC&color=fff`}
                        alt={name} 
                        className="w-9 h-9 rounded-full object-cover border border-white dark:border-slate-700 shadow-sm"
                    />
                )}

                {/* Text Info (Hidden when collapsed) */}
                {!isCollapsed && (
                    <>
                        <div className="flex-1 min-w-0 text-left">
                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {name}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                {email}
                            </p>
                        </div>
                        <Icon 
                            icon="heroicons:chevron-up-down" 
                            className={`w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
                        />
                    </>
                )}
            </button>
        </div>
    );
}