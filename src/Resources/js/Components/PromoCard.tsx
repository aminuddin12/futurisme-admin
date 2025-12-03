import { Icon } from '@iconify/react';

interface PromoCardProps {
    className?: string;
    isCollapsed?: boolean;
}

export default function PromoCard({ className = '', isCollapsed = false }: PromoCardProps) {
    if (isCollapsed) return null;

    return (
        <div className={`fa-p-5 fa-rounded-2xl fa-bg-gradient-to-b fa-from-indigo-50 fa-to-white dark:fa-from-slate-800 dark:fa-to-slate-900 fa-border fa-border-indigo-100/80 dark:fa-border-slate-700 ${className}`}>
            <div className="fa-flex fa-items-center fa-gap-3 fa-mb-3">
                <div className="fa-p-2 fa-bg-white dark:fa-bg-slate-800 fa-rounded-full fa-text-indigo-600 dark:fa-text-indigo-400 fa-shadow-sm fa-border fa-border-indigo-50 dark:fa-border-slate-700">
                    <Icon icon="mdi:creation" width="18" height="18" />
                </div>
                <div>
                    <p className="fa-text-xs fa-font-medium fa-text-slate-500 dark:fa-text-slate-400">Current plan</p>
                    <p className="fa-text-sm fa-font-bold fa-text-slate-900 dark:fa-text-white">Pro trial</p>
                </div>
            </div>
            <button className="fa-w-full fa-bg-white dark:fa-bg-slate-800 fa-border fa-border-slate-200 dark:fa-border-slate-700 fa-text-slate-900 dark:fa-text-white fa-text-xs fa-font-bold fa-py-2.5 fa-rounded-lg fa-shadow-sm hover:fa-border-indigo-300 dark:hover:fa-border-indigo-500 fa-transition-colors fa-flex fa-items-center fa-justify-center fa-gap-2">
                <Icon icon="heroicons:bolt" className="fa-text-indigo-600 dark:fa-text-indigo-400" width="14" height="14" />
                Upgrade
            </button>
        </div>
    );
}