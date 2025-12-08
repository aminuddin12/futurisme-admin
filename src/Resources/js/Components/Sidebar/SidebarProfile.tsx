import { useState, useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { usePage, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { safeRoute } from '../../Utils/routeHelper';

interface Props {
    collapsed: boolean;
}

export default function SidebarProfile({ collapsed }: Props) {
    // 1. Ambil Config & Auth
    const { auth, config } = usePage().props as any;
    const user = auth?.user || { name: 'Guest', email: 'guest@example.com', avatar_url: null, is_super_admin: false };
    const urlPrefix = config?.admin_url_prefix || 'admin';
    
    // 2. State untuk Dropdown Menu Profil
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // 3. URLs
    const logoutUrl = safeRoute('futurisme.logout', `/${urlPrefix}/logout`);
    const profileUrl = safeRoute('futurisme.profile.edit', `/${urlPrefix}/profile`);

    // Helper Avatar Initial
    const initial = user.name ? user.name.charAt(0).toUpperCase() : 'U';

    return (
        <div className="p-4 mt-auto border-t border-gray-100 dark:border-gray-800/50 relative" ref={containerRef}>
            
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        // LOGIKA POSISI MENU:
                        // Jika collapsed: Muncul di KANAN (Floating ke samping)
                        // Jika expanded: Muncul di ATAS (Bottom-up standard)
                        initial={{ opacity: 0, y: 10, x: collapsed ? 10 : 0, scale: 0.95 }}
                        animate={{ opacity: 1, y: collapsed ? 0 : -10, x: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className={`
                            absolute bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50
                            ${collapsed 
                                ? 'bottom-2 left-[calc(100%+8px)] w-56 origin-bottom-left' // Posisi Kanan Sidebar
                                : 'bottom-full left-4 right-4 mb-2 origin-bottom' // Posisi Atas Profil
                            }
                        `}
                    >
                        {/* Header Menu (Tampil di collapsed mode juga agar user tahu siapa yg login) */}
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                        </div>

                        {/* Menu Items */}
                        <div className="p-1.5 space-y-0.5">
                            <Link 
                                href={profileUrl}
                                className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors group"
                            >
                                <Icon icon="solar:user-id-linear" className="w-4.5 h-4.5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                                My Profile
                            </Link>
                            
                            <div className="my-1 border-t border-gray-100 dark:border-gray-700/50 mx-2" />
                            
                            <Link 
                                href={logoutUrl} 
                                method="post" 
                                as="button"
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-xl transition-colors group"
                            >
                                <Icon icon="solar:logout-2-linear" className="w-4.5 h-4.5 group-hover:text-rose-600 transition-colors" />
                                Logout
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- TRIGGER BUTTON --- */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-full flex items-center gap-3 p-2 rounded-xl transition-all duration-200 outline-none select-none group
                    ${isOpen ? 'bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}
                    ${collapsed ? 'justify-center' : ''}
                `}
            >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-[2px] transition-transform group-hover:scale-105">
                        <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden">
                            {user.avatar_url ? (
                                <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="font-bold text-indigo-600 text-sm">
                                    {initial}
                                </span>
                            )}
                        </div>
                    </div>
                    {/* Status Indicator */}
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
                </div>

                {/* Info & Chevron (Hidden if collapsed) */}
                {!collapsed && (
                    <>
                        <div className="flex-1 text-left min-w-0 ml-1">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                {user.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate capitalize">
                                {user.is_super_admin ? 'Super Admin' : 'User'}
                            </p>
                        </div>
                        <Icon 
                            icon="solar:alt-arrow-up-linear" 
                            className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                        />
                    </>
                )}
            </button>
        </div>
    );
}