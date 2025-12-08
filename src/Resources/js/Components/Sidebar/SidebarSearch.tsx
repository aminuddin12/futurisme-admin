import { Icon } from '@iconify/react';

interface Props {
    collapsed: boolean;
}

export default function SidebarSearch({ collapsed }: Props) {
    return (
        <div className={`px-5 py-4 ${collapsed ? 'flex justify-center' : ''}`}>
            {collapsed ? (
                <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-500 hover:text-indigo-600 transition-colors">
                    <Icon icon="solar:magnifer-linear" className="w-5 h-5" />
                </button>
            ) : (
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon icon="solar:magnifer-linear" className="text-gray-400 group-focus-within:text-indigo-500 transition-colors w-4.5 h-4.5" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search..."
                        className="
                            w-full pl-10 pr-4 py-2.5 text-sm rounded-xl
                            bg-gray-50 dark:bg-gray-800/50 
                            border border-transparent focus:border-indigo-500/50 focus:bg-white dark:focus:bg-gray-800
                            text-gray-900 dark:text-gray-200 placeholder-gray-400
                            focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all
                        "
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-xs text-gray-400 border border-gray-200 dark:border-gray-700 px-1.5 py-0.5 rounded">⌘K</span>
                    </div>
                </div>
            )}
        </div>
    );
}