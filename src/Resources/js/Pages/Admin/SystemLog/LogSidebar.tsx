import { Icon } from '@iconify/react';

interface LogSidebarProps {
    currentType: string;
    onTypeChange: (type: string) => void;
}

export default function LogSidebar({ currentType, onTypeChange }: LogSidebarProps) {
    const menuItems = [
        { id: 'activity', label: 'Activity Logs', icon: 'lucide:activity', desc: 'User interactions & database changes' },
        { id: 'traffic', label: 'Traffic & Visitors', icon: 'lucide:globe', desc: 'Real-time visitor tracking & analytics' },
        { id: 'system', label: 'System Errors', icon: 'lucide:alert-triangle', desc: 'Server errors & exceptions' },
    ];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 h-full overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                <h2 className="font-bold text-gray-800 dark:text-white text-sm uppercase tracking-wider">Log Channels</h2>
            </div>
            
            <div className="p-2 space-y-1">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onTypeChange(item.id)}
                        className={`
                            w-full flex items-start gap-3 p-3 rounded-lg transition-all text-left
                            ${currentType === item.id 
                                ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800' 
                                : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 border-transparent'}
                            border
                        `}
                    >
                        <div className={`
                            p-2 rounded-lg mt-0.5
                            ${currentType === item.id ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-800 dark:text-indigo-300' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}
                        `}>
                            <Icon icon={item.icon} className="w-5 h-5" />
                        </div>
                        <div>
                            <span className={`block font-semibold text-sm ${currentType === item.id ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300'}`}>
                                {item.label}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 block">
                                {item.desc}
                            </span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}