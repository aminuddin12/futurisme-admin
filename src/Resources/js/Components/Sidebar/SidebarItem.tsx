import { useState, useEffect, useRef, CSSProperties } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { SidebarMenuItem } from './dummy';
import { safeRoute } from '../../Utils/routeHelper';

interface Props {
    item: SidebarMenuItem;
    collapsed: boolean;
}

export default function SidebarItem({ item, collapsed }: Props) {
    const { url, props } = usePage();
    const { config } = props as any;

    const urlPrefix = config?.admin_url_prefix || 'admin';
    const rawPrimaryColor = config?.theme?.color_primary;
    const primaryColor = (rawPrimaryColor === 'default' || !rawPrimaryColor) ? '#4f46e5' : rawPrimaryColor;

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
            } catch (e) {
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
        hoverTimeoutRef.current = setTimeout(() => {
            setIsHovered(false);
        }, 150); 
    };
    const activeStyle: CSSProperties = {
        backgroundColor: isActive && !hasChildren ? primaryColor : undefined,
        color: isActive && !hasChildren ? '#ffffff' : undefined,
    };

    const parentActiveStyle: CSSProperties = {
        color: hasChildren && (isActive || isChildActive) && !collapsed ? primaryColor : undefined,
        backgroundColor: hasChildren && (isActive || isChildActive) && !collapsed ? `${primaryColor}1A` : undefined, // 1A = 10% opacity hex
    };

    const containerClasses = `
        relative group flex items-center 
        ${collapsed ? 'justify-center w-10 mx-auto px-0' : 'justify-between px-3 w-full'} 
        py-2 rounded-lg transition-all duration-200 cursor-pointer select-none
        ${isActive && !hasChildren
            ? 'shadow-md shadow-indigo-500/20 font-medium' 
            : (hasChildren && (isActive || isChildActive) && !collapsed)
                ? 'font-medium'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
        }
    `;

    return (
        <div 
            className="relative mb-1"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {hasChildren && !collapsed ? (
                <div 
                    onClick={handleClick} 
                    className={containerClasses} 
                    title={item.title}
                    style={parentActiveStyle}
                >
                    <ItemContent item={item} collapsed={collapsed} hasChildren={true} isOpen={isOpen} isActive={isActive} primaryColor={primaryColor} />
                </div>
            ) : (
                <Link 
                    href={hasChildren ? '#' : itemHref} 
                    className={containerClasses}
                    onClick={(e) => hasChildren && e.preventDefault()}
                    style={activeStyle}
                >
                    <ItemContent item={item} collapsed={collapsed} hasChildren={hasChildren} isOpen={isOpen} isActive={isActive} primaryColor={primaryColor} />
                </Link>
            )}

            <AnimatePresence>
                {collapsed && isHovered && hasChildren && (
                    <motion.div
                        initial={{ opacity: 0, x: -5, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -5, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="fixed left-[72px] z-[999] min-w-[180px] bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden py-1"
                        style={{ marginTop: '-40px' }} 
                    >
                        <div className="px-3 py-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800/50 mb-1">
                            {item.title}
                        </div>

                        <ul className="py-1 px-1 space-y-0.5">
                            {item.children!.map((child) => (
                                <li key={child.id}>
                                    <SidebarItem item={child} collapsed={false} /> 
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && hasChildren && !collapsed && (
                    <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden space-y-0.5 mt-1"
                    >
                        {item.children!.map((child) => (
                            <li key={child.id} className="pl-3">
                                <SidebarItem item={child} collapsed={collapsed} />
                            </li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
}

function ItemContent({ item, collapsed, hasChildren, isOpen, isActive, primaryColor }: { item: SidebarMenuItem, collapsed: boolean, hasChildren: boolean, isOpen: boolean, isActive: boolean, primaryColor: string }) {
    return (
        <>
            <div className={`flex items-center ${collapsed ? 'justify-center w-full' : 'gap-3 w-full'}`}>
                <div className={`
                    flex-shrink-0 flex items-center justify-center transition-all
                    ${collapsed ? 'w-5 h-5' : 'w-5 h-5'}
                `}>
                    {item.icon ? (
                        <Icon icon={item.icon} className={`${collapsed ? 'w-5 h-5' : 'w-5 h-5'}`} />
                    ) : (
                        <div 
                            className={`w-1.5 h-1.5 rounded-full opacity-60`} 
                            style={{ backgroundColor: isActive ? '#fff' : 'currentColor' }}
                        />
                    )}
                </div>

                {!collapsed && (
                    <div className="flex-1 flex items-center justify-between min-w-0 ml-1">
                        <span className="text-sm font-medium truncate">
                            {item.title}
                        </span>
                        {hasChildren && (
                            <Icon 
                                icon="solar:alt-arrow-down-linear" 
                                className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} opacity-60 ml-2`} 
                            />
                        )}
                    </div>
                )}
            </div>
        </>
    );
}