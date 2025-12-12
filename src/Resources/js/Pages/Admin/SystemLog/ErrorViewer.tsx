import { useState } from 'react';
import { Icon } from '@iconify/react';
import { router } from '@inertiajs/react';

interface LogEntry {
    timestamp: string;
    env: string;
    level: string;
    message: string;
    id: string;
}

interface ErrorProps {
    data: {
        current_file: string;
        available_files: string[];
        logs: LogEntry[];
    };
}

export default function ErrorViewer({ data }: ErrorProps) {
    const [expandedLogs, setExpandedLogs] = useState<string[]>([]);

    const toggleLog = (id: string) => {
        setExpandedLogs(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        router.get(route('futurisme.logs.index'), { type: 'system', file: e.target.value }, { preserveState: true });
    };

    const getLevelColor = (level: string) => {
        const lvl = level.toLowerCase();
        if (lvl === 'error') return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20';
        if (lvl === 'warning') return 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20';
        if (lvl === 'info') return 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20';
        return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-800';
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <Icon icon="lucide:file-text" className="w-5 h-5 text-gray-500" />
                <div className="flex-1">
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Log File</label>
                    <select 
                        value={data.current_file}
                        onChange={handleFileChange}
                        className="w-full md:w-64 border-none bg-gray-50 dark:bg-gray-900 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 p-2"
                    >
                        {data.available_files.map(f => (
                            <option key={f} value={f}>{f}</option>
                        ))}
                    </select>
                </div>
                <div className="text-right">
                    <span className="text-2xl font-bold text-gray-800 dark:text-white">{data.logs.length}</span>
                    <span className="text-xs text-gray-500 block">Entries</span>
                </div>
            </div>

            <div className="bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-800">
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-950 border-b border-gray-800">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                    </div>
                    <span className="text-xs text-gray-500 font-mono ml-2">Console Output</span>
                </div>
                
                <div className="divide-y divide-gray-800/50">
                    {data.logs.length > 0 ? (
                        data.logs.map((log) => (
                            <div key={log.id} className="group hover:bg-gray-800/50 transition-colors">
                                <div 
                                    className="flex items-start gap-4 p-4 cursor-pointer"
                                    onClick={() => toggleLog(log.id)}
                                >
                                    <span className="text-xs font-mono text-gray-500 whitespace-nowrap pt-0.5">
                                        {log.timestamp}
                                    </span>
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${getLevelColor(log.level)}`}>
                                        {log.level}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-mono text-gray-300 truncate group-hover:text-white transition-colors">
                                            {log.message.split('\n')[0]}
                                        </p>
                                    </div>
                                    <Icon 
                                        icon="lucide:chevron-down" 
                                        className={`w-4 h-4 text-gray-600 transition-transform ${expandedLogs.includes(log.id) ? 'rotate-180' : ''}`} 
                                    />
                                </div>
                                
                                {expandedLogs.includes(log.id) && (
                                    <div className="px-4 pb-4 pl-32">
                                        <div className="bg-black/30 rounded p-3 overflow-x-auto">
                                            <pre className="text-xs font-mono text-gray-400 whitespace-pre-wrap leading-relaxed">
                                                {log.message}
                                            </pre>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-gray-600 font-mono text-sm">
                            No logs found in this file.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}