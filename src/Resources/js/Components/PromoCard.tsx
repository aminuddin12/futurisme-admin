import { Icon } from '@iconify/react';

interface PromoCardProps {
    className?: string;
    isCollapsed?: boolean;
}

export default function PromoCard({ className = '', isCollapsed = false }: PromoCardProps) {
    if (isCollapsed) return null;

    return (
        <div className={`p-5 rounded-2xl bg-gradient-to-b from-indigo-50 to-white dark:from-slate-800 dark:to-slate-900 border border-indigo-100/80 dark:border-slate-700 ${className}`}>
            <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-white dark:bg-slate-800 rounded-full text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-50 dark:border-slate-700">
                    <Icon icon="mdi:creation" width="18" height="18" />
                </div>
                <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Current plan</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Pro trial</p>
                </div>
            </div>
            <button className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold py-2.5 rounded-lg shadow-sm hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors flex items-center justify-center gap-2">
                <Icon icon="heroicons:bolt" className="text-indigo-600 dark:text-indigo-400" width="14" height="14" />
                Upgrade
            </button>
        </div>
    );
}