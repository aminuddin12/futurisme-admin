import { Link, usePage } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

    // Tentukan Menu Utama yang akan dirender
    // Jika props 'menus' kosong, gunakan 'defaultMenus' dari dummy.ts
    const menuItems = menus.length > 0 ? menus : defaultMenus;

    useEffect(() => {
        if (menus.length === 0) setIsUsingDummy(true);
    }, [menus]);

    // Memisahkan Quick Links (Inbox/Notif) dari Menu Utama
    const quickLinks = menuItems.filter(item => !item.header && !item.children && ['Inbox', 'Notifications'].includes(item.title));
    
    // Main Menu adalah sisanya
    const mainMenus = menuItems.filter(item => !quickLinks.includes(item));

    return (
        <aside 
            className={`
                bg-[#F7F8FA] dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col flex-shrink-0 h-screen sticky top-0 transition-all duration-300
                ${isCollapsed ? 'w-20' : 'w-72'} 
                ${className}
            `}
        >
            <SidebarHeader isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />

            {isCollapsed && (
                <div className="flex justify-center mb-4">
                    <button 
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                        <Icon icon="heroicons:chevron-double-right" width="20" height="20" />
                    </button>
                </div>
            )}

            {isUsingDummy && !isCollapsed && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="mx-4 mb-4 px-3 py-2 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg flex items-start gap-2"
                >
                    <Icon icon="heroicons:exclamation-triangle" className="w-4 h-4 text-amber-600 dark:text-amber-500 mt-0.5" />
                    <div>
                        <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">Using Dummy Data</p>
                    </div>
                </motion.div>
            )}

            <SidebarSearch isCollapsed={isCollapsed} />

            <div className={`flex-1 overflow-y-auto custom-scrollbar pb-6 ${isCollapsed ? 'px-2' : 'px-3'}`}>
                
                {/* 1. Quick Links Section */}
                {quickLinks.length > 0 && (
                    <motion.ul 
                        className="space-y-0.5 mb-6"
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
                    className="space-y-0.5"
                    variants={listVariants}
                    initial="hidden"
                    animate="show"
                >
                    {mainMenus.map((item, index) => {
                        // Jika item adalah HEADER Group
                        if (item.header) {
                            return (
                                <motion.li key={item.id} className="mt-6 first:mt-0" variants={itemVariants}>
                                    {!isCollapsed ? (
                                        <div className="px-4 mb-2">
                                            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                                {item.header}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="my-4 mx-2 h-px bg-slate-200 dark:bg-slate-700"></div>
                                    )}
                                    
                                    {/* Render Children dari Group Header */}
                                    {item.children && (
                                        <ul className="space-y-0.5">
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
                        
                        // Render Item Biasa (yang bukan header & bukan quick link)
                        return (
                            <motion.li key={item.id} variants={itemVariants}>
                                <SidebarItem item={item} urlPrefix={urlPrefix} isCollapsed={isCollapsed} />
                            </motion.li>
                        );
                    })}
                </motion.ul>

                <motion.div 
                    className="mx-4 mt-8"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <PromoCard isCollapsed={isCollapsed} />
                </motion.div>

                {/* Bottom Menus (Static / Footer Menus) */}
                <motion.ul 
                    className={`space-y-0.5 mt-6 pt-4 ${isCollapsed ? 'border-t-0' : 'border-t border-slate-200/60 dark:border-slate-800 mx-2'}`}
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