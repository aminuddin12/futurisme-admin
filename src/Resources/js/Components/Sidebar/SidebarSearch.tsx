import { Icon } from '@iconify/react';

interface SidebarSearchProps {
    isCollapsed: boolean;
}

export default function SidebarSearch({ isCollapsed }: SidebarSearchProps) {
    if (isCollapsed) {
        return (
            <div className="px-2 mb-4 flex justify-center">
                <button className="p-2.5 rounded-lg text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                    <Icon icon="heroicons:magnifying-glass" className="w-5 h-5" />
                </button>
            </div>
        );
    }

    return (
        <div className="px-5 mb-4">
            <div className="relative group">
                <Icon 
                    icon="heroicons:magnifying-glass" 
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 w-5 h-5 transition-colors"
                />
                <input 
                    type="text" 
                    placeholder="Quick search" 
                    className="w-full pl-10 pr-4 py-2 bg-transparent border-none focus:ring-0 text-sm text-slate-600 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 font-medium"
                />
            </div>
        </div>
    );
}