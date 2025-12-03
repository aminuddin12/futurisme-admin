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
        if (isCollapsed) return 'fa-justify-center fa-px-0';
        switch(d) {
            case 0: return 'fa-pl-1'; 
            case 1: return 'fa-pl-3'; 
            case 2: return 'fa-pl-6'; 
            default: return 'fa-pl-1';
        }
    };
    const paddingLeftClass = getPaddingClass(depth);

    // --- STYLING CLASSES ---
    const listItemClass = `fa-mb-1 ${isCollapsed ? 'fa-px-2' : 'fa-px-3'} fa-relative`;

    const disableClick = isSelfActive && !hasChildren ? 'fa-pointer-events-none fa-cursor-default' : 'fa-cursor-pointer';

    const justifyClass = isCollapsed ? 'fa-justify-center' : 'fa-justify-start';

    const linkBaseClass = `
        fa-group fa-flex fa-items-center fa-w-full fa-py-2.5 fa-text-sm fa-font-medium fa-rounded-lg fa-transition-all fa-duration-200
        ${paddingLeftClass} ${justifyClass} fa-pr-3
        ${disableClick}
    `;

    const activeClass = `
        fa-bg-indigo-600 fa-text-white fa-shadow-md fa-border fa-border-indigo-700
        dark:fa-bg-indigo-600 dark:fa-text-white
    `;

    const inactiveClass = `
        fa-text-slate-600 hover:fa-text-slate-900 hover:fa-bg-slate-100 fa-border fa-border-transparent
        dark:fa-text-slate-400 dark:hover:fa-text-white dark:hover:fa-bg-slate-800/50
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
                className="fa-flex-1 fa-overflow-hidden fa-whitespace-nowrap fa-relative fa-mr-2"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <motion.span
                    ref={textRef}
                    className={`fa-block ${isActive ? 'fa-font-semibold' : ''}`}
                    animate={isOverflowing && isHovered ? { x: [0, -50, 0] } : { x: 0 }}
                    transition={isOverflowing && isHovered ? { duration: 4, repeat: Infinity, ease: "linear", repeatType: "mirror" } : {}}
                >
                    {text}
                </motion.span>
                {isOverflowing && !isHovered && !isActive && (
                    <div className="fa-absolute fa-right-0 fa-top-0 fa-bottom-0 fa-w-6 fa-bg-gradient-to-l fa-from-white/0 fa-to-transparent"></div>
                )}
            </div>
        );
    };

    if (hasChildren) {
        return (
            <li className={listItemClass}>
                <button
                    onClick={() => !isCollapsed && setIsOpen(!isOpen)}
                    className={`${linkBaseClass} ${isOpen || isActive ? 'fa-text-indigo-700 fa-bg-indigo-50 dark:fa-text-indigo-300 dark:fa-bg-indigo-900/20' : 'fa-text-slate-600 hover:fa-bg-slate-100 dark:fa-text-slate-400 dark:hover:fa-bg-slate-800/50'}`}
                    title={isCollapsed ? item.title : undefined}
                >
                    <div className={`fa-flex fa-items-center fa-gap-3 fa-overflow-hidden ${isCollapsed ? 'fa-justify-center fa-w-full' : 'fa-flex-1'}`}>
                        {item.icon && (
                            <Icon 
                                icon={item.icon} 
                                className={`fa-w-5 fa-h-5 fa-flex-shrink-0 ${isOpen || isActive ? 'fa-text-indigo-600 dark:fa-text-indigo-400' : 'fa-text-slate-500 dark:fa-text-slate-500'}`} 
                            />
                        )}
                        {!isCollapsed && <MarqueeText text={item.title} isActive={Boolean(isOpen || isActive)} />}
                    </div>
                    {!isCollapsed && (
                        <Icon 
                            icon="heroicons:chevron-down" 
                            className={`fa-w-4 fa-h-4 fa-flex-shrink-0 fa-ml-auto fa-transition-transform fa-duration-200 ${isOpen ? 'fa-rotate-180 fa-text-indigo-600' : 'fa-text-slate-400'}`} 
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
                            className="fa-overflow-hidden fa-mt-1 fa-space-y-0.5"
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
                <div className={`fa-flex fa-items-center fa-gap-3 fa-overflow-hidden ${isCollapsed ? 'fa-justify-center fa-w-full' : 'fa-flex-1'}`}>
                    {item.icon && (
                        <Icon 
                            icon={item.icon} 
                            className={`fa-w-5 fa-h-5 fa-flex-shrink-0 ${isActive ? 'fa-text-white' : 'fa-text-slate-500 group-hover:fa-text-slate-700 dark:fa-text-slate-500 dark:group-hover:fa-text-slate-300'}`} 
                        />
                    )}
                    {!isCollapsed && <MarqueeText text={item.title} isActive={isActive} />}
                </div>
                
                {!isCollapsed && item.badge && (
                    <span className={`fa-ml-auto fa-text-xs fa-font-medium fa-flex-shrink-0 fa-px-2 fa-py-0.5 fa-rounded-full ${isActive ? 'fa-bg-white/20 fa-text-white' : 'fa-bg-slate-100 fa-text-slate-600 dark:fa-bg-slate-700 dark:fa-text-slate-300'}`}>
                        {item.badge}
                    </span>
                )}
                
                {isCollapsed && item.badge && (
                    <span className="fa-absolute fa-top-2 fa-right-2 fa-w-2 fa-h-2 fa-bg-red-500 fa-rounded-full"></span>
                )}
            </Link>
        </li>
    );
}