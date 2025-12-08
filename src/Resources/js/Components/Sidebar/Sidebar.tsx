import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { SidebarMenuItem, DUMMY_MENU } from './dummy';

// Components
import SidebarHeader from './SidebarHeader';
import SidebarSearch from './SidebarSearch';
import SidebarItem from './SidebarItem';
import SidebarProfile from './SidebarProfile';

interface SidebarProps {
    menus?: SidebarMenuItem[];
    isCollapsed?: boolean;
    onToggle?: () => void;
}

export default function Sidebar({ menus: propMenus, isCollapsed: controlledCollapsed, onToggle: controlledToggle }: SidebarProps) {
    const { menus: serverMenus, config } = usePage().props as any;
    const menus: SidebarMenuItem[] = 
        (propMenus && propMenus.length > 0) ? propMenus : 
        (serverMenus && serverMenus.length > 0) ? serverMenus : 
        DUMMY_MENU;

    const [localCollapsed, setLocalCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const isControlled = controlledCollapsed !== undefined;
    const collapsed = isControlled ? controlledCollapsed : localCollapsed;
    
    const handleToggle = () => {
        if (isControlled && controlledToggle) {
            controlledToggle();
        } else {
            setLocalCollapsed(!localCollapsed);
        }
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) setIsMobileOpen(false);
        };

        const handleMobileOpen = () => setIsMobileOpen(true);

        window.addEventListener('resize', handleResize);
        window.addEventListener('open-mobile-sidebar', handleMobileOpen);
        
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('open-mobile-sidebar', handleMobileOpen);
        };
    }, []);

    const expandedWidth = 280;
    const collapsedWidth = 80;

    return (
        <>
            {isMobileOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            <motion.aside
                initial={false}
                animate={{ 
                    width: collapsed ? collapsedWidth : expandedWidth,
                    x: isMobileOpen ? 0 : (window.innerWidth < 1024 ? -expandedWidth : 0)
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={`
                    fixed top-0 left-0 h-full z-50 bg-white dark:bg-gray-950 border-r border-gray-100 dark:border-gray-800/60
                    flex flex-col flex-shrink-0 transition-all shadow-xl lg:shadow-none
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
                style={{ width: collapsed ? collapsedWidth : expandedWidth }}
            >
                <SidebarHeader 
                    collapsed={collapsed} 
                    onToggle={handleToggle} 
                />

                <SidebarSearch collapsed={collapsed} />
                <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 space-y-6 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
                    <nav className="space-y-1">
                        {menus.map((item) => (
                            <SidebarItem 
                                key={item.id} 
                                item={item} 
                                collapsed={collapsed} 
                            />
                        ))}
                    </nav>
                </div>
                <SidebarProfile collapsed={collapsed} />
            </motion.aside>
        </>
    );
}