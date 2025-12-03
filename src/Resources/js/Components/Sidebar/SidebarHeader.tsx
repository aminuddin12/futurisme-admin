import { Icon } from '@iconify/react';
import LogoDefault from './LogoDefault';

interface SidebarHeaderProps {
    isCollapsed: boolean;
    onToggle: () => void;
}

export default function SidebarHeader({ isCollapsed, onToggle }: SidebarHeaderProps) {
    return (
        <div className={`fa-h-16 fa-flex fa-items-center fa-justify-between fa-mb-2 fa-transition-all fa-duration-300 ${isCollapsed ? 'fa-px-0 fa-justify-center' : 'fa-px-5'}`}>
            
            <div className={`fa-flex fa-items-center ${isCollapsed ? 'fa-justify-center fa-w-full' : ''}`}>
                {!isCollapsed ? (
                    <LogoDefault />
                ) : (
                    <div className="fa-w-8 fa-h-8 fa-overflow-hidden fa-flex fa-justify-center">
                         <LogoDefault textClassName="fa-hidden" className="fa-gap-0" />
                    </div>
                )}
            </div>

            {!isCollapsed && (
                <button 
                    onClick={onToggle}
                    className="fa-p-1.5 fa-rounded-md hover:fa-bg-slate-200 dark:hover:fa-bg-slate-800 fa-text-slate-400 hover:fa-text-slate-600 dark:hover:fa-text-slate-200 fa-transition-colors"
                >
                    <Icon icon="heroicons:bars-3-bottom-left" width="20" height="20" />
                </button>
            )}
        </div>
    );
}