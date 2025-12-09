import { useState, useEffect, useRef, CSSProperties } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { safeRoute } from '../../Utils/routeHelper';

// Definisi Interface Menu (Lokal, Murni dari Database Struktur)
export interface SidebarMenuItem {
    id: number;
    title: string;
    url: string | null;
    icon: string | null;
    parent_id: number | null;
    order: number;
    permission_name: string | null;
    is_active: number;
    group?: string;
    children?: SidebarMenuItem[];
}

interface Props {
    item: SidebarMenuItem;
    collapsed: boolean;
}

export default function SidebarItem({ item, collapsed }: Props) {
    const { url, props } = usePage();
    const { config } = props as any;

    const urlPrefix = config?.admin_url_prefix || 'admin';
    const primaryColor = config?.theme?.color_primary || '#4f46e5';
    const secondaryColor = config?.theme?.color_secondary || '#ec4899';

    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const hasChildren = Array.isArray(item.children) && item.children.length > 0;

    const getHref = (menuUrl: string | null): string => {
        if (!menuUrl) return '#';
        const isRouteName = menuUrl.includes('.') && !menuUrl.includes('/');
        
        if (isRouteName) {
            try {
                return safeRoute(menuUrl, '#');
            } catch {
                return '#';
            }
        } else {
            const cleanPath = menuUrl.startsWith('/') ? menuUrl.substring(1) : menuUrl;
            return `/${urlPrefix}/${cleanPath}`;
        }
    };

    const itemHref = getHref(item.url);

    const checkActive = (menuUrl: string | null, children?: SidebarMenuItem[]): boolean => {
        if (!menuUrl && !children) return false;
        
        const safeUrl = url || '';
        const currentPath = safeUrl.startsWith('/') ? safeUrl.substring(1) : safeUrl;

        if (children && children.length > 0) {
            return children.some(child => checkActive(child.url, child.children));
        }

        if (menuUrl) {
            if (menuUrl.includes('.') && !menuUrl.includes('/')) {
                try {
                    return route().current(menuUrl + '*');
                } catch { return false; }
            }
            const targetPath = menuUrl.startsWith('/') ? menuUrl.substring(1) : menuUrl;
            const fullTargetPath = `${urlPrefix}/${targetPath}`;
            return currentPath === fullTargetPath || currentPath.startsWith(fullTargetPath + '/');
        }
        return false;
    };

    const isActive = checkActive(item.url, item.children);
    const isChildActive = hasChildren && item.children!.some(child => checkActive(child.url, child.children));

    useEffect(() => {
        if (isChildActive && !collapsed) setIsOpen(true);
    }, [isChildActive, collapsed]);

    const handleClick = (e: React.MouseEvent) => {
        if (hasChildren && !collapsed) {
            e.preventDefault();
            setIsOpen(!isOpen);
        }
    };

    const handleMouseEnter = () => {
        if (!collapsed) return;
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        if (!collapsed) return;
        hoverTimeoutRef.current = setTimeout(() => setIsHovered(false), 150); 
    };

    const indicatorStyle: CSSProperties = {
        backgroundColor: isActive ? secondaryColor : 'transparent',
    };

    const iconStyle: CSSProperties = {
        color: isActive ? primaryColor : undefined,
    };

    const containerClasses = `
        relative flex items-center 
        ${collapsed ? 'justify-center w-10 mx-auto' : 'justify-between px-3 w-full'} 
        py-2.5 rounded-xl transition-all duration-200 cursor-pointer select-none group overflow-hidden
        ${isActive 
            ? 'bg-gray-50 dark:bg-gray-800/60 font-medium' 
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/40 hover:text-gray-900 dark:hover:text-gray-200'
        }
    `;

    return (
        <div 
            className="relative mb-1"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {hasChildren && !collapsed ? (
                <div onClick={handleClick} className={containerClasses} title={item.title}>
                    <ItemContent 
                        item={item} collapsed={collapsed} hasChildren={true} isOpen={isOpen} 
                        isActive={isActive || isChildActive} 
                        indicatorStyle={indicatorStyle} iconStyle={iconStyle}
                    />
                </div>
            ) : (
                <Link 
                    href={hasChildren ? '#' : itemHref} 
                    className={containerClasses}
                    onClick={(e) => hasChildren && e.preventDefault()}
                >
                    <ItemContent 
                        item={item} collapsed={collapsed} hasChildren={hasChildren} isOpen={isOpen} 
                        isActive={isActive} 
                        indicatorStyle={indicatorStyle} iconStyle={iconStyle}
                    />
                </Link>
            )}

            <AnimatePresence>
                {collapsed && isHovered && (
                    <motion.div
                        initial={{ opacity: 0, x: -5, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -5, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="fixed left-[72px] z-[999] min-w-[190px] bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden py-1"
                        style={{ marginTop: '-42px' }} 
                    >
                        <div className="px-4 py-2.5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50/80 dark:bg-gray-800/80 border-b border-gray-100 dark:border-gray-800/50 mb-1">
                            {item.title}
                        </div>
                        {hasChildren ? (
                            <ul className="py-1 px-1 space-y-0.5">
                                {item.children!.map((child) => (
                                    <li key={child.id}>
                                        <SidebarItem item={child} collapsed={false} /> 
                                    </li>
                                ))}
                            </ul>
                        ) : (
                             <div className="px-1 pb-1">
                                <Link href={itemHref} className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
                                    Open {item.title}
                                </Link>
                             </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && hasChildren && !collapsed && (
                    <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden space-y-0.5 mt-1 relative"
                    >
                        <div className="absolute left-[21px] top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-800"></div>
                        
                        {item.children!.map((child) => (
                            <li key={child.id} className="pl-3 relative">
                                <SidebarItem item={child} collapsed={collapsed} />
                            </li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
}

function ItemContent({ 
    item, collapsed, hasChildren, isOpen, isActive, indicatorStyle, iconStyle 
}: { 
    item: SidebarMenuItem, collapsed: boolean, hasChildren: boolean, isOpen: boolean, isActive: boolean, indicatorStyle: CSSProperties, iconStyle: CSSProperties 
}) {
    return (
        <>
            {isActive && (
                <motion.div 
                    layoutId="activeStrip"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-md transition-all"
                    style={indicatorStyle}
                />
            )}

            <div className={`flex items-center ${collapsed ? 'justify-center w-full' : 'gap-3 w-full'}`}>
                <div className={`
                    flex-shrink-0 flex items-center justify-center transition-all duration-300
                    ${collapsed ? 'w-6 h-6' : 'w-5 h-5 ml-1'}
                `} style={iconStyle}>
                    {item.icon ? (
                        <Icon icon={item.icon} className="w-full h-full" />
                    ) : (
                        <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'scale-125' : 'opacity-60'}`} style={{ backgroundColor: 'currentColor' }} />
                    )}
                </div>

                {!collapsed && (
                    <div className="flex-1 flex items-center justify-between min-w-0 overflow-hidden">
                        <span className="text-sm font-medium truncate leading-none pt-0.5">
                            {item.title}
                        </span>
                        {hasChildren && (
                            <Icon 
                                icon="solar:alt-arrow-down-linear" 
                                className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180 text-gray-900 dark:text-white' : 'opacity-50'}`} 
                            />
                        )}
                    </div>
                )}
            </div>
        </>
    );
}