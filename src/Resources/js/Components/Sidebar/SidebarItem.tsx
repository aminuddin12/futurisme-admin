import { Link, usePage } from '@inertiajs/react';
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
    
    // Logika Aktif yang Lebih Ketat
    // Pastikan hasil selalu boolean (true/false)
    const isSelfActive = item.url ? isRouteActive(item.url) : false;
    
    const isChildActive = hasChildren && item.children 
        ? item.children.some(child => child.url && isRouteActive(child.url))
        : false;
    
    // State aktif final (Pastikan boolean)
    const isActive = Boolean(isSelfActive || isChildActive);
    
    // Fallback URL
    const fallbackPath = item.url 
        ? item.url.split('.').slice(1).join('/').replace('index', '') 
        : '#';
    const fallbackUrl = item.url ? `/${urlPrefix}/${fallbackPath}`.replace(/\/$/, '') : '#';
    const finalUrl = item.url ? safeRoute(item.url, fallbackUrl) : '#';

    // Auto expand jika child aktif
    useEffect(() => {
        if (hasChildren && !isCollapsed) {
            if (isChildActive) setIsOpen(true);
        } else if (isCollapsed) {
            setIsOpen(false);
        }
    }, [item.children, hasChildren, isCollapsed, isChildActive]);

    const getPaddingClass = (d: number) => {
        if (isCollapsed) return 'fa-justify-center fa-px-0';
        switch(d) {
            case 0: return 'fa-pl-3';
            case 1: return 'fa-pl-9'; 
            case 2: return 'fa-pl-14';
            default: return 'fa-pl-3';
        }
    };
    const paddingLeftClass = getPaddingClass(depth);

    // --- Styling Classes ---
    const listItemClass = `fa-mb-1 ${isCollapsed ? 'fa-px-2' : 'fa-px-3'} fa-relative`;

    // Base Link Class
    const disableClick = isSelfActive && !hasChildren ? 'fa-pointer-events-none fa-cursor-default' : 'fa-cursor-pointer';

    // PERBAIKAN LAYOUT:
    // Gunakan 'justify-between' hanya jika perlu memisahkan konten kiri (icon+text) dengan kanan (chevron/badge)
    // Jika collapsed, 'justify-center'
    const justifyClass = isCollapsed ? 'fa-justify-center' : 'fa-justify-between';

    const linkBaseClass = `
        fa-group fa-flex fa-items-center fa-w-full fa-py-2.5 fa-text-sm fa-font-medium fa-rounded-lg fa-transition-all fa-duration-200
        ${paddingLeftClass} ${justifyClass} fa-pr-3
        ${disableClick}
    `;

    // Active State: White bg + indigo text (Light), Dark bg + indigo text (Dark)
    // Tambahkan border-indigo-100 agar lebih pop
    const activeClass = `
        fa-bg-white fa-text-indigo-600 fa-shadow-sm fa-border fa-border-indigo-100
        dark:fa-bg-slate-800 dark:fa-text-indigo-400 dark:fa-border-indigo-900/50
    `;

    // Inactive State: Gray text
    const inactiveClass = `
        fa-text-slate-600 hover:fa-text-slate-900 hover:fa-bg-slate-100 fa-border fa-border-transparent
        dark:fa-text-slate-400 dark:hover:fa-text-white dark:hover:fa-bg-slate-800/50
    `;

    // --- Logic Animasi Marquee (Text Berjalan) ---
    const MarqueeText = ({ text, isActive }: { text: string, isActive: boolean }) => {
        const textRef = useRef<HTMLSpanElement>(null);
        const containerRef = useRef<HTMLDivElement>(null);
        const [isOverflowing, setIsOverflowing] = useState(false);
        const [isHovered, setIsHovered] = useState(false);

        useEffect(() => {
            if (textRef.current && containerRef.current) {
                setIsOverflowing(textRef.current.scrollWidth > containerRef.current.clientWidth);
            }
        }, [text, isCollapsed]); 

        if (isCollapsed) return null; 

        return (
            <div 
                ref={containerRef}
                className="fa-flex-1 fa-overflow-hidden fa-whitespace-nowrap fa-relative"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <motion.span
                    ref={textRef}
                    className={`fa-block ${isActive ? 'fa-font-semibold' : ''}`}
                    animate={
                        isOverflowing && isHovered 
                        ? { x: [0, -50, 0] } 
                        : { x: 0 }
                    }
                    transition={
                        isOverflowing && isHovered
                        ? { 
                            duration: 3, 
                            repeat: Infinity, 
                            ease: "linear",
                            repeatType: "mirror" 
                          }
                        : {}
                    }
                >
                    {text}
                </motion.span>
                
                {isOverflowing && !isHovered && (
                    <div className="fa-absolute fa-right-0 fa-top-0 fa-bottom-0 fa-w-4 fa-bg-gradient-to-l fa-from-white/0 fa-to-transparent"></div>
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
                    <div className={`fa-flex fa-items-center fa-gap-3 fa-overflow-hidden ${isCollapsed ? 'fa-justify-center fa-w-full' : 'fa-w-full'}`}>
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
                            className={`fa-w-4 fa-h-4 fa-flex-shrink-0 fa-transition-transform fa-duration-200 ${isOpen ? 'fa-rotate-180 fa-text-indigo-600' : 'fa-text-slate-400'}`} 
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
                onClick={(e) => isSelfActive && e.preventDefault()}
            >
                <div className={`fa-flex fa-items-center fa-gap-3 fa-overflow-hidden ${isCollapsed ? 'fa-justify-center fa-w-full' : 'fa-w-full'}`}>
                    {item.icon && (
                        <Icon 
                            icon={item.icon} 
                            className={`fa-w-5 fa-h-5 fa-flex-shrink-0 ${isActive ? 'fa-text-indigo-600 dark:fa-text-indigo-400' : 'fa-text-slate-500 group-hover:fa-text-slate-700 dark:fa-text-slate-500 dark:group-hover:fa-text-slate-300'}`} 
                        />
                    )}
                    {!isCollapsed && <MarqueeText text={item.title} isActive={isActive} />}
                </div>
                
                {/* Badge dipisahkan di kanan */}
                {!isCollapsed && item.badge && (
                    <span className={`fa-text-xs fa-font-medium fa-flex-shrink-0 fa-ml-2 ${isActive ? 'fa-text-indigo-700 dark:fa-text-indigo-300' : 'fa-text-slate-500'}`}>
                        {item.badge}
                    </span>
                )}
                
                {/* Indikator Merah saat Collapsed (Dot) */}
                {isCollapsed && item.badge && (
                    <span className="fa-absolute fa-top-2 fa-right-2 fa-w-2 fa-h-2 fa-bg-red-500 fa-rounded-full"></span>
                )}
            </Link>
        </li>
    );
}