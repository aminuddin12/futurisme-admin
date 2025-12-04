import { Link } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { safeRoute, isRouteActive } from '../../Utils/routeHelper';

export interface SidebarItemType {
    id: number;
    title: string;
    url?: string | null;
    icon?: string | null;
    children?: SidebarItemType[];
    header?: string; 
    badge?: string | number;
}

interface SidebarItemProps {
    item: SidebarItemType;
    depth?: number;
    urlPrefix: string;
    isCollapsed?: boolean;
}

export default function SidebarItem({ 
    item, 
    depth = 0, 
    urlPrefix, 
    isCollapsed = false 
}: SidebarItemProps) {
    const hasChildren = item.children && item.children.length > 0;
    const [isOpen, setIsOpen] = useState(false);
    
    // --- LOGIKA AKTIF YANG LEBIH ROBUST ---
    const checkRouteActive = (targetRouteName: string | null | undefined): boolean => {
        if (!targetRouteName) return false;

        // Cara 1: Coba pakai Ziggy .current()
        try {
            // @ts-ignore
            if (typeof window !== 'undefined' && typeof window.route === 'function') {
                // @ts-ignore
                const r = window.route(); // Dapatkan instance router
                
                // Cek apakah instance valid
                if (r && typeof r.current === 'function') {
                    // @ts-ignore
                    // Cek apakah rute saat ini COCOK dengan targetRouteName
                    // Ziggy .current(name) mengembalikan boolean true/false
                    // HATI-HATI: route().current() tanpa param return string, dengan param return boolean.
                    // Kita gunakan versi dengan parameter untuk cek match.
                    const isMatch = r.current(targetRouteName); 
                    
                    if (isMatch) {
                        // console.log(`[SI-CheckRouteActive] - Match found via Ziggy for ${targetRouteName}`);
                        return true;
                    }

                    // Cek wildcard manual jika Ziggy strict (misal 'futurisme.users.*')
                    // @ts-ignore
                    const currentRouteName = r.current(); 
                    
                    // FIX: Explicit check for string type before using startsWith
                    // @ts-ignore
                    if (typeof currentRouteName === 'string' && currentRouteName.startsWith(targetRouteName + '.')) {
                         return true;
                    }
                }
            }
        } catch (e) { 
            // Ziggy error, lanjut ke cara 2
            // console.warn(`[SI-CheckRouteActive] - Ziggy check failed:`, e);
        }

        // Cara 2: Fallback Manual menggunakan URL Path (Jika Ziggy gagal/crash)
        // Ini solusi pamungkas untuk error "Cannot convert undefined or null to object"
        try {
            if (typeof window !== 'undefined') {
                const currentPath = window.location.pathname; // misal: /admin/dashboard
                
                // Konstruksi URL yang diharapkan dari targetRouteName
                // Asumsi sederhana: futurisme.dashboard -> /admin/dashboard
                // Kita pakai logika yang sama dengan fallbackUrl
                const expectedPath = targetRouteName.split('.').slice(1).join('/').replace('index', '');
                const expectedUrl = `/${urlPrefix}/${expectedPath}`.replace(/\/$/, '');

                // Cek apakah URL browser diawali dengan URL yang diharapkan
                // Tambahkan '/' di akhir untuk menghindari partial match (misal /admin/user vs /admin/users)
                if (currentPath === expectedUrl || currentPath.startsWith(expectedUrl + '/')) {
                    // console.log(`[SI-CheckRouteActive] - Match found via URL Path for ${targetRouteName}`);
                    return true;
                }
            }
        } catch (e) { }

        return false;
    };

    const isSelfActive = checkRouteActive(item.url);
    
    const checkChildActive = (children: SidebarItemType[]): boolean => {
        return children.some(child => {
            if (checkRouteActive(child.url)) return true;
            if (child.children) return checkChildActive(child.children);
            return false;
        });
    };

    const isChildActive = hasChildren && item.children 
        ? checkChildActive(item.children)
        : false;
    
    const isActive = Boolean(isSelfActive || isChildActive);
    
    // Fallback URL
    const fallbackPath = item.url 
        ? item.url.split('.').slice(1).join('/').replace('index', '') 
        : '#';
    const fallbackUrl = item.url ? `/${urlPrefix}/${fallbackPath}`.replace(/\/$/, '') : '#';
    const finalUrl = item.url ? safeRoute(item.url, fallbackUrl) : '#';

    // Auto expand
    useEffect(() => {
        if (hasChildren && !isCollapsed) {
            if (isChildActive) setIsOpen(true);
        } else if (isCollapsed) {
            setIsOpen(false);
        }
    }, [item.children, hasChildren, isCollapsed, isChildActive]);

    // --- LOGIKA PADDING ---
    const getPaddingClass = (d: number) => {
        if (isCollapsed) return 'justify-center px-0';
        switch(d) {
            case 0: return 'pl-1'; 
            case 1: return 'pl-3'; 
            case 2: return 'pl-6'; 
            default: return 'pl-1';
        }
    };
    const paddingLeftClass = getPaddingClass(depth);

    // --- STYLING CLASSES ---
    const listItemClass = `mb-1 ${isCollapsed ? 'px-2' : 'px-3'} relative`;

    const disableClick = isSelfActive && !hasChildren ? 'pointer-events-none cursor-default' : 'cursor-pointer';

    const justifyClass = isCollapsed ? 'justify-center' : 'justify-start';

    const linkBaseClass = `
        group flex items-center w-full py-2.5 text-sm font-medium rounded-lg transition-all duration-200
        ${paddingLeftClass} ${justifyClass} pr-1
        ${disableClick}
    `;

    const activeClass = `
        bg-indigo-600 text-white shadow-md border border-indigo-700
        dark:bg-indigo-600 dark:text-white
    `;

    const inactiveClass = `
        text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent
        dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/50
    `;

    // --- Logic Animasi Marquee ---
    const MarqueeText = ({ text, isActive }: { text: string, isActive: boolean }) => {
        const textRef = useRef<HTMLSpanElement>(null);
        const containerRef = useRef<HTMLDivElement>(null);
        const [isOverflowing, setIsOverflowing] = useState(false);
        const [isHovered, setIsHovered] = useState(false);

        useEffect(() => {
            if (textRef.current && containerRef.current) {
                const isLongText = text.length > 25;
                const isScrollable = textRef.current.scrollWidth > containerRef.current.clientWidth;
                setIsOverflowing(isLongText && isScrollable);
            }
        }, [text, isCollapsed]); 

        if (isCollapsed) return null; 

        return (
            <div 
                ref={containerRef}
                className="flex overflow-hidden whitespace-nowrap relative mr-1"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <motion.span
                    ref={textRef}
                    className={`block ${isActive ? 'font-semibold' : ''}`}
                    animate={isOverflowing && isHovered ? { x: [0, -50, 0] } : { x: 0 }}
                    transition={isOverflowing && isHovered ? { duration: 4, repeat: Infinity, ease: "linear", repeatType: "mirror" } : {}}
                >
                    {text}
                </motion.span>
                {isOverflowing && !isHovered && !isActive && (
                    <div className="absolute right-0 top-0 bottom-0 w-6 bg-linear-to-l from-white/0 to-transparent"></div>
                )}
            </div>
        );
    };

    if (hasChildren) {
        return (
            <li className={listItemClass}>
                <button
                    onClick={() => !isCollapsed && setIsOpen(!isOpen)}
                    className={`${linkBaseClass} ${isOpen || isActive ? 'text-indigo-700 bg-indigo-50 dark:text-indigo-300 dark:bg-indigo-900/20' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/50'}`}
                    title={isCollapsed ? item.title : undefined}
                >
                    <div className={`flex items-center gap-3 overflow-hidden ${isCollapsed ? 'justify-center w-full' : 'flex'}`}>
                        {item.icon && (
                            <Icon 
                                icon={item.icon} 
                                className={`w-5 h-5 shrink-0 ${isOpen || isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-500'}`} 
                            />
                        )}
                        {!isCollapsed && <MarqueeText text={item.title} isActive={Boolean(isOpen || isActive)} />}
                    </div>
                    {!isCollapsed && (
                        <Icon 
                            icon="heroicons:chevron-down" 
                            className={`w-4 h-4 shrink-0 ml-auto transition-transform duration-200 ${isOpen ? 'rotate-180 text-indigo-600' : 'text-slate-400'}`} 
                        />
                    )}
                </button>
                
                <AnimatePresence>
                    {isOpen && !isCollapsed && (
                        <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden mt-1 space-y-0.5"
                        >
                            {item.children?.map(child => (
                                <SidebarItem key={child.id} item={child} depth={depth + 1} urlPrefix={urlPrefix} isCollapsed={isCollapsed} />
                            ))}
                        </motion.ul>
                    )}
                </AnimatePresence>
            </li>
        );
    }

    return (
        <li className={listItemClass}>
            <Link
                href={finalUrl}
                className={`${linkBaseClass} ${isActive ? activeClass : inactiveClass}`}
                title={isCollapsed ? item.title : undefined}
                onClick={(e) => {
                    if (isSelfActive) e.preventDefault();
                }}
            >
                <div className={`flex items-center gap-3 overflow-hidden ${isCollapsed ? 'justify-center w-full' : 'flex'}`}>
                    {item.icon && (
                        <Icon 
                            icon={item.icon} 
                            className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-700 dark:text-slate-500 dark:group-hover:text-slate-300'}`} 
                        />
                    )}
                    {!isCollapsed && <MarqueeText text={item.title} isActive={isActive} />}
                </div>
                
                {!isCollapsed && item.badge && (
                    <span className={`ml-auto text-xs font-medium shrink-0 px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>
                        {item.badge}
                    </span>
                )}
                
                {isCollapsed && item.badge && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
            </Link>
        </li>
    );
}