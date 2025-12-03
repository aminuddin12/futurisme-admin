import { Icon } from '@iconify/react';

interface SidebarSearchProps {
    isCollapsed: boolean;
}

export default function SidebarSearch({ isCollapsed }: SidebarSearchProps) {
    if (isCollapsed) {
        return (
            <div className="fa-px-2 fa-mb-4 fa-flex fa-justify-center">
                <button className="fa-p-2.5 fa-rounded-lg fa-text-slate-400 hover:fa-bg-slate-200 dark:hover:fa-bg-slate-800 hover:fa-text-slate-600 dark:hover:fa-text-slate-200 fa-transition-colors">
                    <Icon icon="heroicons:magnifying-glass" className="fa-w-5 fa-h-5" />
                </button>
            </div>
        );
    }

    return (
        <div className="fa-px-5 fa-mb-4">
            <div className="fa-relative fa-group">
                <Icon 
                    icon="heroicons:magnifying-glass" 
                    className="fa-absolute fa-left-3 fa-top-1/2 -fa-translate-y-1/2 fa-text-slate-400 group-hover:fa-text-slate-600 dark:group-hover:fa-text-slate-300 fa-w-5 fa-h-5 fa-transition-colors"
                />
                <input 
                    type="text" 
                    placeholder="Quick search" 
                    className="fa-w-full fa-pl-10 fa-pr-4 fa-py-2 fa-bg-transparent fa-border-none focus:fa-ring-0 fa-text-sm fa-text-slate-600 dark:fa-text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 fa-font-medium"
                />
            </div>
        </div>
    );
}