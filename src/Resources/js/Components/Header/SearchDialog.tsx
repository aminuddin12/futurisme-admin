import { Fragment, useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { router } from '@inertiajs/react';

interface SearchResult {
    id: number;
    title: string;
    category: string;
    url: string;
}

interface SearchDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);

    // Mock Search Function (Ganti dengan API call nanti)
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.length > 1) {
                setLoading(true);
                try {
                    // Simulasi API Call
                    // const response = await axios.get(`/api/admin/search?q=${query}`);
                    // setResults(response.data);
                    
                    // Mock Data
                    const mockData = [
                        { id: 1, title: 'User Management', category: 'Menu', url: 'futurisme.users.index' },
                        { id: 2, title: 'Sales Report 2024', category: 'Report', url: '#' },
                        { id: 3, title: 'System Settings', category: 'Settings', url: 'futurisme.settings' },
                        { id: 4, title: 'Create New Order', category: 'Action', url: '#' },
                    ].filter(item => item.title.toLowerCase().includes(query.toLowerCase()));

                    setResults(mockData);
                } catch (error) {
                    console.error("Search failed", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    // Handle Navigasi
    const handleNavigate = (url: string) => {
        // Gunakan logic safeRoute atau router.visit
        // router.visit(route(url)); 
        console.log("Navigating to:", url);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50"
                    />

                    {/* Modal Panel */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="fixed inset-0 z-50 flex items-start justify-center pt-24 pointer-events-none"
                    >
                        <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl pointer-events-auto overflow-hidden border border-slate-200 dark:border-slate-700 mx-4">
                            
                            {/* Search Input Header */}
                            <div className="relative flex items-center p-4 border-b border-slate-100 dark:border-slate-800">
                                <Icon icon="heroicons:magnifying-glass" className="w-6 h-6 text-slate-400" />
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Search commands, users, or pages..."
                                    className="flex-1 bg-transparent border-none text-slate-900 dark:text-white text-lg placeholder-slate-400 focus:ring-0 ml-3"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                                <div className="flex items-center gap-2">
                                    <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">ESC</kbd>
                                    <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                                        <Icon icon="heroicons:x-mark" className="w-5 h-5 text-slate-400" />
                                    </button>
                                </div>
                            </div>

                            {/* Results Body */}
                            <div className="max-h-96 overflow-y-auto custom-scrollbar">
                                {loading ? (
                                    <div className="p-8 text-center text-slate-500">
                                        <Icon icon="eos-icons:loading" className="w-8 h-8 mx-auto mb-2 animate-spin" />
                                        <p>Searching...</p>
                                    </div>
                                ) : results.length > 0 ? (
                                    <div className="p-2">
                                        {/* Grouping Logic could be added here */}
                                        <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase">Top Results</div>
                                        
                                        {results.map((result) => (
                                            <button
                                                key={result.id}
                                                onClick={() => handleNavigate(result.url)}
                                                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 group transition-colors"
                                            >
                                                <div className="p-2 rounded-md bg-slate-100 dark:bg-slate-800 group-hover:bg-white dark:group-hover:bg-slate-700 text-slate-500 dark:text-slate-400 group-hover:text-indigo-600">
                                                    <Icon icon={result.category === 'Menu' ? 'heroicons:list-bullet' : 'heroicons:document-text'} className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-indigo-700 dark:group-hover:text-indigo-400">
                                                        {result.title}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        {result.category}
                                                    </p>
                                                </div>
                                                <Icon icon="heroicons:chevron-right" className="w-4 h-4 text-slate-300 group-hover:text-indigo-400" />
                                            </button>
                                        ))}
                                    </div>
                                ) : query.length > 1 ? (
                                    <div className="p-12 text-center">
                                        <Icon icon="heroicons:magnifying-glass" className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                                        <p className="text-slate-900 dark:text-white font-medium">No results found</p>
                                        <p className="text-sm text-slate-500">We couldn't find anything matching "{query}"</p>
                                    </div>
                                ) : (
                                    <div className="p-12 text-center">
                                        <p className="text-sm text-slate-400">Type something to start searching...</p>
                                    </div>
                                )}
                            </div>

                            {/* Footer Hints */}
                            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                                <div className="flex gap-4">
                                    <span className="flex items-center"><kbd className="font-sans bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded px-1.5 mr-1">↵</kbd> to select</span>
                                    <span className="flex items-center"><kbd className="font-sans bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded px-1.5 mr-1">↑↓</kbd> to navigate</span>
                                </div>
                                <span>Futurisme Search</span>
                            </div>

                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}