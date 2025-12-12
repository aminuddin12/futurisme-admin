import { useState } from 'react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';

interface Visit {
    id: number;
    ip_address: string;
    method: string;
    url: string;
    referer: string;
    user_agent: string;
    device: string;
    platform: string;
    browser: string;
    user_id: number;
    created_at: string;
    cookies: any;
    user?: { name: string; email: string };
    admin?: { name: string; email: string };
}

interface TrafficProps {
    data: {
        stats: {
            total: number;
            unique: number;
            auth: number;
            guest: number;
        };
        visits: {
            data: Visit[];
            links: any[];
            current_page: number;
            last_page: number;
            total: number;
        };
    };
}

export default function VisitorViewer({ data }: TrafficProps) {
    const [expandedRow, setExpandedRow] = useState<number | null>(null);

    const toggleRow = (id: number) => {
        if (expandedRow === id) {
            setExpandedRow(null);
        } else {
            setExpandedRow(id);
        }
    };

    const StatCard = ({ title, value, icon, color }: any) => (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-lg ${color}`}>
                <Icon icon={icon} className="w-6 h-6" />
            </div>
            <div>
                <span className="block text-2xl font-bold text-gray-900 dark:text-white">{value}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{title}</span>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard title="Total Visits" value={data.stats.total} icon="lucide:globe" color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" />
                <StatCard title="Unique Visitors" value={data.stats.unique} icon="lucide:fingerprint" color="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" />
                <StatCard title="Authenticated" value={data.stats.auth} icon="lucide:user-check" color="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" />
                <StatCard title="Guests" value={data.stats.guest} icon="lucide:users" color="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                    <h3 className="text-sm font-bold text-gray-800 dark:text-white uppercase tracking-wider">Live Traffic Feed</h3>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th className="px-6 py-3 w-10"></th>
                                <th className="px-6 py-3">Time</th>
                                <th className="px-6 py-3">Visitor</th>
                                <th className="px-6 py-3">Page</th>
                                <th className="px-6 py-3">Device</th>
                                <th className="px-6 py-3">IP Address</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {data.visits.data.length > 0 ? (
                                data.visits.data.map((visit) => (
                                    <>
                                        <tr 
                                            key={visit.id} 
                                            onClick={() => toggleRow(visit.id)}
                                            className={`
                                                cursor-pointer transition-colors
                                                ${expandedRow === visit.id ? 'bg-indigo-50 dark:bg-indigo-900/20' : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50'}
                                            `}
                                        >
                                            <td className="px-6 py-4 text-center">
                                                <Icon 
                                                    icon="lucide:chevron-right" 
                                                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${expandedRow === visit.id ? 'rotate-90 text-indigo-500' : ''}`} 
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-mono text-xs">
                                                {new Date(visit.created_at).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {visit.user_id ? (
                                                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded text-xs font-bold">
                                                            <Icon icon="lucide:user-check" className="w-3 h-3" />
                                                            {visit.admin?.name || visit.user?.name || 'Auth User'}
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1 text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-xs font-bold">
                                                            <Icon icon="lucide:ghost" className="w-3 h-3" />
                                                            Guest
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col max-w-xs">
                                                    <span className="font-medium text-gray-800 dark:text-gray-200 truncate" title={visit.url}>
                                                        {visit.url.replace(/^.*\/\/[^\/]+/, '')}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col text-xs text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <Icon icon={visit.device === 'Mobile' ? 'lucide:smartphone' : 'lucide:monitor'} className="w-3 h-3" />
                                                        {visit.device}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col text-xs">
                                                    <span className="font-mono text-gray-600 dark:text-gray-300">{visit.ip_address}</span>
                                                </div>
                                            </td>
                                        </tr>
                                        
                                        {/* EXPANDED DETAIL ROW */}
                                        <AnimatePresence>
                                            {expandedRow === visit.id && (
                                                <tr>
                                                    <td colSpan={6} className="p-0 border-none">
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="overflow-hidden bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 shadow-inner"
                                                        >
                                                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                                                                <div className="space-y-3">
                                                                    <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                                                        <Icon icon="lucide:monitor" className="w-4 h-4" /> Device Info
                                                                    </h4>
                                                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                                                        <span className="text-gray-500">Browser:</span>
                                                                        <span className="font-medium text-gray-700 dark:text-gray-300">{visit.browser}</span>
                                                                        <span className="text-gray-500">Platform:</span>
                                                                        <span className="font-medium text-gray-700 dark:text-gray-300">{visit.platform}</span>
                                                                        <span className="text-gray-500">User Agent:</span>
                                                                        <span className="font-medium text-gray-700 dark:text-gray-300 truncate" title={visit.user_agent}>{visit.user_agent}</span>
                                                                    </div>
                                                                </div>

                                                                <div className="space-y-3">
                                                                    <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                                                        <Icon icon="lucide:link" className="w-4 h-4" /> Navigation
                                                                    </h4>
                                                                    <div className="grid grid-cols-1 gap-2 text-xs">
                                                                        <div>
                                                                            <span className="text-gray-500 block">Full URL:</span>
                                                                            <a href={visit.url} target="_blank" className="font-medium text-indigo-600 hover:underline truncate block w-full">{visit.url}</a>
                                                                        </div>
                                                                        <div>
                                                                            <span className="text-gray-500 block">Referrer:</span>
                                                                            <span className="font-medium text-gray-700 dark:text-gray-300 truncate block w-full">{visit.referer || 'Direct Access'}</span>
                                                                        </div>
                                                                        <div>
                                                                            <span className="text-gray-500 block">Method:</span>
                                                                            <span className="font-mono font-bold text-gray-700 dark:text-gray-300">{visit.method}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="space-y-3">
                                                                    <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                                                        <Icon icon="lucide:cookie" className="w-4 h-4" /> Cookie Data
                                                                    </h4>
                                                                    {visit.cookies ? (
                                                                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 font-mono text-[10px] text-gray-600 dark:text-gray-400 overflow-x-auto max-h-32">
                                                                            <div className="grid grid-cols-2 gap-1">
                                                                                <span>Screen:</span> <span>{visit.cookies.screen_width}x{visit.cookies.screen_height}</span>
                                                                                <span>Timezone:</span> <span>{visit.cookies.timezone}</span>
                                                                                <span>Lang:</span> <span>{visit.cookies.language}</span>
                                                                                <span>Conn:</span> <span>{visit.cookies.connection}</span>
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <span className="text-xs text-gray-400 italic">No detailed cookie data captured.</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    </td>
                                                </tr>
                                            )}
                                        </AnimatePresence>
                                    </>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        No traffic recorded yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}