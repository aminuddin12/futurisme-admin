import { Icon } from '@iconify/react';
import LogoDefault from './LogoDefault';

interface SidebarHeaderProps {
    isCollapsed: boolean;
    onToggle: () => void;
}

export default function SidebarHeader({ isCollapsed, onToggle }: SidebarHeaderProps) {
    return (
        <div className={`h-16 flex items-center justify-between mb-2 transition-all duration-300 ${isCollapsed ? 'px-0 justify-center' : 'px-5'}`}>
            
            <div className={`flex items-center ${isCollapsed ? 'justify-center w-full' : ''}`}>
                {!isCollapsed ? (
                    <LogoDefault />
                ) : (
                    <div className="w-8 h-8 overflow-hidden flex justify-center">
                         <LogoDefault textClassName="hidden" className="gap-0" />
                    </div>
                )}
            </div>

            {!isCollapsed && (
                <button 
                    onClick={onToggle}
                    className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                    <Icon icon="heroicons:bars-3-bottom-left" width="20" height="20" />
                </button>
            )}
        </div>
    );
}