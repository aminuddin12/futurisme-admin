import { useState, useEffect, useMemo } from 'react';
import { usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';

// Components
import SidebarHeader from './SidebarHeader';
import SidebarSearch from './SidebarSearch';
import SidebarItem from './SidebarItem';
import SidebarProfile from './SidebarProfile';

// Interface Definisi Menu (Lokal, menggantikan dummy)
export interface SidebarMenuItem {
    id: number;
    title: string;
    url: string | null;
    route: string | null; 
    icon: string | null;
    parent_id: number | null;
    order: number;
    permission_name: string | null;
    is_active: number;
    group?: string;
    children?: SidebarMenuItem[];
}

interface SidebarProps {
    menus?: SidebarMenuItem[];
    isCollapsed?: boolean;
    onToggle?: () => void;
}

export default function Sidebar({ menus: propMenus, isCollapsed: controlledCollapsed, onToggle: controlledToggle }: SidebarProps) {
    // Ambil data menus dari Inertia (Backend)
    const { menus: serverMenus } = usePage().props as any;
    
    // Gunakan props menu jika ada, jika tidak gunakan serverMenus, jika tidak ada array kosong.
    // TIDAK ADA LAGI DUMMY_MENU.
    const menus: SidebarMenuItem[] = 
        (propMenus && propMenus.length > 0) ? propMenus : 
        (serverMenus && serverMenus.length > 0) ? serverMenus : 
        [];

    const [localCollapsed, setLocalCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // Logic Controlled Component (Sesuai kode Anda)
    const isControlled = controlledCollapsed !== undefined;
    const collapsed = isControlled ? controlledCollapsed : localCollapsed;
    
    const handleToggle = () => {
        if (isControlled && controlledToggle) {
            controlledToggle();
        } else {
            setLocalCollapsed(!localCollapsed);
        }
    };

    // Logic Grouping (Sesuai permintaan fitur sebelumnya)
    const groupedMenus = useMemo(() => {
        const groups: { [key: string]: SidebarMenuItem[] } = {};
        
        menus.forEach(item => {
            if (item.group === 'User') return; // Skip User group (for profile)

            // Default group 'Main' jika null/undefined
            const groupName = item.group || 'Main';
            
            if (!groups[groupName]) {
                groups[groupName] = [];
            }
            groups[groupName].push(item);
        });

        return groups;
    }, [menus]);

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

                <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 space-y-6 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800 pb-20">
                    {/* Render Grouped Menus */}
                    {Object.entries(groupedMenus).map(([groupName, items]) => (
                        <div key={groupName} className="space-y-1">
                            {/* Group Header */}
                            <div className={`flex items-center px-3 mb-2 mt-4 ${collapsed ? 'justify-center' : ''}`}>
                                {!collapsed ? (
                                    <>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 whitespace-nowrap">
                                            {groupName}
                                        </span>
                                        <div className="ml-3 h-px bg-gray-100 dark:bg-gray-800 flex-1"></div>
                                    </>
                                ) : (
                                    <div className="w-full h-px bg-gray-100 dark:bg-gray-800 my-1"></div>
                                )}
                            </div>

                            <nav className="space-y-0.5">
                                {items.map((item) => (
                                    <SidebarItem 
                                        key={item.id} 
                                        item={item} 
                                        collapsed={collapsed} 
                                    />
                                ))}
                            </nav>
                        </div>
                    ))}
                </div>
                
                <SidebarProfile collapsed={collapsed} />
            </motion.aside>
        </>
    );
}