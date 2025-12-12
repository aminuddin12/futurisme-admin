import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

interface ActivityProps {
    data: {
        list: Record<string, any[]>;
        pagination: any;
    };
}

export default function ActivityViewer({ data }: ActivityProps) {
    const getActionColor = (event: string) => {
        switch(event) {
            case 'created': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
            case 'updated': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
            case 'deleted': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400';
            default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
        }
    };

    if (!data || Object.keys(data.list).length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Icon icon="lucide:clipboard-list" className="w-16 h-16 mb-4 opacity-50" />
                <p>No activity logs found</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {Object.entries(data.list).map(([date, logs], groupIndex) => (
                <motion.div 
                    key={date}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: groupIndex * 0.1 }}
                    className="relative"
                >
                    <div className="sticky top-0 z-10 flex items-center gap-4 mb-4 bg-gray-50/95 dark:bg-gray-900/95 py-2 backdrop-blur-sm">
                        <div className="h-px bg-gray-300 dark:bg-gray-700 flex-1"></div>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider bg-white dark:bg-gray-800 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm">
                            {new Date(date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                        <div className="h-px bg-gray-300 dark:bg-gray-700 flex-1"></div>
                    </div>

                    <div className="space-y-3">
                        {logs.map((log: any) => (
                            <div key={log.id} className="group relative bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 flex flex-col items-center gap-1">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold text-sm">
                                            {log.causer?.name ? log.causer.name.charAt(0) : '?'}
                                        </div>
                                        <div className="h-full w-px bg-gray-200 dark:bg-gray-700 group-last:hidden"></div>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-gray-900 dark:text-white text-sm">
                                                    {log.causer?.name || 'System'}
                                                </span>
                                                <span className="text-xs text-gray-400">•</span>
                                                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide ${getActionColor(log.event)}`}>
                                                    {log.event}
                                                </span>
                                            </div>
                                            <span className="text-xs font-mono text-gray-400">
                                                {new Date(log.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        
                                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                                            {log.description}
                                        </p>

                                        {log.subject_type && (
                                            <div className="mt-2 flex items-center gap-2 text-xs text-gray-400 bg-gray-50 dark:bg-gray-900/50 p-2 rounded border border-gray-100 dark:border-gray-800 w-fit">
                                                <Icon icon="lucide:box" className="w-3 h-3" />
                                                <span className="font-mono">{log.subject_type}</span>
                                                <span className="text-gray-300 dark:text-gray-600">#</span>
                                                <span className="font-mono">{log.subject_id}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            ))}
        </div>
    );
}