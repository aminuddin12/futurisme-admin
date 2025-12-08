import { Icon } from '@iconify/react';
import { usePage } from '@inertiajs/react';
import LogoDefault from './LogoDefault';
import { CSSProperties, useState } from 'react';

interface SidebarHeaderProps {
    collapsed: boolean; 
    onToggle: () => void;
}

export default function SidebarHeader({ collapsed, onToggle }: SidebarHeaderProps) {
    const { config } = usePage().props as any;
    
    const appName = config?.site_name || 'Futurisme';
    const siteLogo = config?.logo_url;
    const rawPrimaryColor = config?.theme?.color_primary;
    const primaryColor = (rawPrimaryColor === 'default' || !rawPrimaryColor) ? '#4f46e5' : rawPrimaryColor;

    const hasCustomLogo = 
        siteLogo && 
        typeof siteLogo === 'string' && 
        siteLogo.trim() !== '' && 
        siteLogo !== 'default_logo';
    const [isHovered, setIsHovered] = useState(false);

    const toggleButtonStyle: CSSProperties = {
        color: isHovered ? primaryColor : undefined,
        backgroundColor: isHovered && !collapsed ? `${primaryColor}1A` : (collapsed ? `${primaryColor}1A` : undefined), 
    };

    const iconStyle: CSSProperties = {
        color: collapsed ? primaryColor : (isHovered ? primaryColor : undefined),
    };

    return (
        <div className={`
            h-20 flex items-center mb-2 transition-all duration-300 flex-shrink-0 border-b border-gray-100 dark:border-gray-800/50
            ${collapsed ? 'justify-center px-0' : 'justify-between px-5'}
        `}>
            {!collapsed && (
                <div className="flex items-center justify-center overflow-hidden">
                    {hasCustomLogo ? (
                        <div className="flex items-center justify-center h-10">
                            <img 
                                src={siteLogo} 
                                alt={appName} 
                                className="object-contain transition-all duration-300 h-9 max-w-[140px]"
                            />
                        </div>
                    ) : (
                        <LogoDefault />
                    )}
                </div>
            )}
            <button 
                onClick={onToggle}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`
                    p-2 rounded-xl text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 focus:outline-none
                    ${collapsed ? 'w-10 h-10 flex items-center justify-center' : ''}
                `}
                style={toggleButtonStyle}
                title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
                <Icon 
                    icon="solar:sidebar-minimalistic-bold-duotone" 
                    width="24" 
                    height="24" 
                    className={`transition-transform duration-500 ${collapsed ? 'rotate-180' : ''}`}
                    style={iconStyle}
                />
            </button>
        </div>
    );
}