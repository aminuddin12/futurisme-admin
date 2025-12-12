import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'framer-motion';

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextInput from '@/Components/TextInput';
import LogSidebar from './LogSidebar';
import ActivityViewer from './ActivityViewer';
import ErrorViewer from './ErrorViewer';
import VisitorViewer from './VisitorViewer';

interface PageProps {
    type: 'activity' | 'system' | 'traffic';
    data: any;
    filters: any;
}

export default function SystemLogIndex({ type, data, filters }: PageProps) {
    const [isLive, setIsLive] = useState(false);
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isLive) {
            interval = setInterval(() => {
                router.reload({ only: ['data'], preserveScroll: true, preserveState: true } as any);
            }, 5000);
        }
        return () => clearInterval(interval);
    }, [isLive]);

    const handleTypeChange = (newType: string) => {
        router.get(route('futurisme.logs.index'), { type: newType }, { preserveState: false });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('futurisme.logs.index'), 
            { type, search }, 
            { preserveState: true, preserveScroll: true }
        );
    };

    const clearLogs = () => {
        if (confirm('Clear current logs? This is irreversible.')) {
            router.delete(route('futurisme.logs.clear'), { data: { type } });
        }
    };

    return (
        <AuthenticatedLayout header="System Logs & Monitoring">
            <Head title="System Logs" />

            <div className="py-6 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-[calc(100vh-4rem)] flex flex-col">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                            <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-600/20">
                                <Icon icon="lucide:activity" className="w-6 h-6 text-white" />
                            </div>
                            System Monitor
                        </h1>
                        <p className="text-sm text-gray-500 mt-1 ml-1">Real-time system surveillance and diagnostics</p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <form onSubmit={handleSearch} className="relative flex-1 md:flex-none">
                            <TextInput
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search logs..."
                                className="pl-9 w-full md:w-64 text-sm"
                            />
                            <Icon icon="lucide:search" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </form>

                        <button
                            onClick={() => setIsLive(!isLive)}
                            className={`p-2 rounded-lg transition-all border ${isLive ? 'bg-emerald-50 border-emerald-200 text-emerald-600 shadow-sm' : 'bg-white border-gray-200 text-gray-400'}`}
                            title="Toggle Live Updates"
                        >
                            <Icon icon="lucide:zap" className={`w-5 h-5 ${isLive ? 'animate-pulse' : ''}`} />
                        </button>

                        <button
                            onClick={clearLogs}
                            className="p-2 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all"
                            title="Clear Logs"
                        >
                            <Icon icon="lucide:trash-2" className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-3 lg:h-full">
                        <div className="sticky top-6">
                            <LogSidebar currentType={type} onTypeChange={handleTypeChange} />
                        </div>
                    </div>

                    <div className="lg:col-span-9 h-full overflow-hidden flex flex-col bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={type}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {type === 'activity' && <ActivityViewer data={data} />}
                                    {type === 'system' && <ErrorViewer data={data} />}
                                    {type === 'traffic' && <VisitorViewer data={data} />}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                        
                        {(type === 'activity' || type === 'traffic') && data.pagination && (
                            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-between items-center text-xs text-gray-500">
                                <span>Showing {data.pagination.from}-{data.pagination.to} of {data.pagination.total}</span>
                                <div className="flex gap-1">
                                    {data.pagination.links.map((link: any, i: number) => (
                                        <button
                                            key={i}
                                            onClick={() => link.url && router.get(link.url, { type, search }, { preserveState: true })}
                                            disabled={!link.url || link.active}
                                            className={`px-3 py-1 rounded ${link.active ? 'bg-indigo-600 text-white' : 'bg-white border hover:bg-gray-50'}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}