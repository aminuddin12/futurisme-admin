import { usePage } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { defaultMenus, bottomMenus } from './dummy';
import SidebarItem, { SidebarItemType } from './SidebarItem';
import SidebarHeader from './SidebarHeader';
import SidebarSearch from './SidebarSearch';
import SidebarProfile from './SidebarProfile';
import PromoCard from '../PromoCard';

interface SidebarProps {
    menus: SidebarItemType[];
    className?: string;
}

// Konfigurasi Animasi Container (Parent)
const listVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1
        }
    }
};

// Konfigurasi Animasi Item (Children)
const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 }
};

export default function Sidebar({ menus = [], className = '' }: SidebarProps) {
    const { auth, config } = usePage().props as any;
    const urlPrefix = config?.url_prefix || 'admin';
    
    const user = auth?.user || { name: 'Guest', email: 'guest@example.com', avatar_url: null };

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isUsingDummy, setIsUsingDummy] = useState(false);

    // --- LOG DATA UNTUK DEBUGGING ---
    console.log('[Sidebar] Data menus dari props:', menus);
    // ---------------------------------

    // Tentukan Menu Utama yang akan dirender
    // Jika props 'menus' kosong (array kosong), gunakan 'defaultMenus' dari dummy.ts
    const menuItems = menus && menus.length > 0 ? menus : defaultMenus;

    useEffect(() => {
        if (!menus || menus.length === 0) {
            console.warn('[Sidebar] Database menu kosong. Menggunakan dummy data.');
            setIsUsingDummy(true);
        } else {
            setIsUsingDummy(false);
        }
    }, [menus]);

    // Memisahkan Quick Links (Inbox/Notif) dari Menu Utama
    // Asumsi: Quick Links adalah item tanpa 'header' dan tanpa 'children' di awal array
    const quickLinks = menuItems.filter(item => !item.header && !item.children && ['Inbox', 'Notifications'].includes(item.title));
    
    // Main Menu adalah sisanya
    const mainMenus = menuItems.filter(item => !quickLinks.includes(item));

    return (
        <aside 
            className={`
                fa-bg-[#F7F8FA] dark:fa-bg-slate-900 fa-border-r fa-border-slate-200 dark:fa-border-slate-800 fa-flex fa-flex-col fa-flex-shrink-0 fa-h-screen fa-sticky fa-top-0 fa-transition-all fa-duration-300
                ${isCollapsed ? 'fa-w-20' : 'fa-w-72'} 
                ${className}
            `}
        >
            <SidebarHeader isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />

            {isCollapsed && (
                <div className="fa-flex fa-justify-center fa-mb-4">
                    <button 
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="fa-p-2 fa-rounded-md hover:fa-bg-slate-200 dark:hover:fa-bg-slate-800 fa-text-slate-400 hover:fa-text-slate-600 dark:hover:fa-text-slate-200 fa-transition-colors"
                    >
                        <Icon icon="heroicons:chevron-double-right" width="20" height="20" />
                    </button>
                </div>
            )}

            {isUsingDummy && !isCollapsed && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="fa-mx-4 fa-mb-4 fa-px-3 fa-py-2 fa-bg-amber-50 dark:fa-bg-amber-900/30 fa-border fa-border-amber-200 dark:fa-border-amber-800 fa-rounded-lg fa-flex fa-items-start fa-gap-2"
                >
                    <Icon icon="heroicons:exclamation-triangle" className="fa-w-4 fa-h-4 fa-text-amber-600 dark:fa-text-amber-500 fa-mt-0.5" />
                    <div>
                        <p className="fa-text-xs fa-text-amber-700 dark:fa-text-amber-400 fa-font-medium">Using Dummy Data</p>
                    </div>
                </motion.div>
            )}

            <SidebarSearch isCollapsed={isCollapsed} />

            <div className={`fa-flex-1 fa-overflow-y-auto custom-scrollbar fa-pb-6 ${isCollapsed ? 'fa-px-2' : 'fa-px-3'}`}>
                
                {/* 1. Quick Links Section */}
                {quickLinks.length > 0 && (
                    <motion.ul 
                        className="fa-space-y-0.5 fa-mb-6"
                        variants={listVariants}
                        initial="hidden"
                        animate="show"
                    >
                        {quickLinks.map((item) => (
                            <motion.div key={item.id} variants={itemVariants}>
                                <SidebarItem item={item} urlPrefix={urlPrefix} isCollapsed={isCollapsed} />
                            </motion.div>
                        ))}
                    </motion.ul>
                )}

                {/* 2. Main Menu Section */}
                <motion.ul 
                    className="fa-space-y-0.5"
                    variants={listVariants}
                    initial="hidden"
                    animate="show"
                >
                    {mainMenus.map((item, index) => {
                        if (item.header) {
                            return (
                                <motion.li key={item.id} className="fa-mt-6 first:fa-mt-0" variants={itemVariants}>
                                    {!isCollapsed ? (
                                        <div className="fa-px-4 fa-mb-2">
                                            <p className="fa-text-xs fa-font-bold fa-text-slate-400 dark:fa-text-slate-500 fa-uppercase fa-tracking-wider">
                                                {item.header}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="fa-my-4 fa-mx-2 fa-h-px fa-bg-slate-200 dark:fa-bg-slate-700"></div>
                                    )}
                                    
                                    {item.children && (
                                        <ul className="fa-space-y-0.5">
                                            {item.children.map(child => (
                                                <motion.div key={child.id} variants={itemVariants}>
                                                    <SidebarItem item={child} urlPrefix={urlPrefix} isCollapsed={isCollapsed} />
                                                </motion.div>
                                            ))}
                                        </ul>
                                    )}
                                </motion.li>
                            );
                        }
                        
                        return (
                            <motion.li key={item.id} variants={itemVariants}>
                                <SidebarItem item={item} urlPrefix={urlPrefix} isCollapsed={isCollapsed} />
                            </motion.li>
                        );
                    })}
                </motion.ul>

                <motion.div 
                    className="fa-mx-4 fa-mt-8"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <PromoCard isCollapsed={isCollapsed} />
                </motion.div>

                <motion.ul 
                    className={`fa-space-y-0.5 fa-mt-6 fa-pt-4 ${isCollapsed ? 'fa-border-t-0' : 'fa-border-t fa-border-slate-200/60 dark:fa-border-slate-800 fa-mx-2'}`}
                    variants={listVariants}
                    initial="hidden"
                    animate="show"
                >
                    {bottomMenus.map((item) => (
                        <motion.li key={item.id} variants={itemVariants}>
                            <SidebarItem item={item} urlPrefix={urlPrefix} isCollapsed={isCollapsed} />
                        </motion.li>
                    ))}
                </motion.ul>
            </div>

            <SidebarProfile 
                isCollapsed={isCollapsed} 
                name={user.name} 
                email={user.email} 
                avatarUrl={user.avatar_url} 
            />
        </aside>
    );
}