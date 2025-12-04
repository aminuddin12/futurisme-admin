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
                        className="fa-fixed fa-inset-0 fa-bg-slate-900/50 fa-backdrop-blur-sm fa-z-50"
                    />

                    {/* Modal Panel */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="fa-fixed fa-inset-0 fa-z-50 fa-flex fa-items-start fa-justify-center fa-pt-24 fa-pointer-events-none"
                    >
                        <div className="fa-w-full fa-max-w-2xl fa-bg-white dark:fa-bg-slate-900 fa-rounded-xl fa-shadow-2xl fa-pointer-events-auto fa-overflow-hidden fa-border fa-border-slate-200 dark:fa-border-slate-700 fa-mx-4">
                            
                            {/* Search Input Header */}
                            <div className="fa-relative fa-flex fa-items-center fa-p-4 fa-border-b fa-border-slate-100 dark:fa-border-slate-800">
                                <Icon icon="heroicons:magnifying-glass" className="fa-w-6 fa-h-6 fa-text-slate-400" />
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Search commands, users, or pages..."
                                    className="fa-flex-1 fa-bg-transparent fa-border-none fa-text-slate-900 dark:fa-text-white fa-text-lg fa-placeholder-slate-400 focus:fa-ring-0 fa-ml-3"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                                <div className="fa-flex fa-items-center fa-gap-2">
                                    <kbd className="fa-hidden sm:fa-inline-block fa-px-2 fa-py-1 fa-text-xs fa-font-semibold fa-text-slate-500 fa-bg-slate-100 dark:fa-bg-slate-800 fa-rounded fa-border fa-border-slate-200 dark:fa-border-slate-700">ESC</kbd>
                                    <button onClick={onClose} className="fa-p-1 fa-hover:bg-slate-100 dark:fa-hover:bg-slate-800 fa-rounded">
                                        <Icon icon="heroicons:x-mark" className="fa-w-5 fa-h-5 fa-text-slate-400" />
                                    </button>
                                </div>
                            </div>

                            {/* Results Body */}
                            <div className="fa-max-h-96 fa-overflow-y-auto custom-scrollbar">
                                {loading ? (
                                    <div className="fa-p-8 fa-text-center fa-text-slate-500">
                                        <Icon icon="eos-icons:loading" className="fa-w-8 fa-h-8 fa-mx-auto fa-mb-2 fa-animate-spin" />
                                        <p>Searching...</p>
                                    </div>
                                ) : results.length > 0 ? (
                                    <div className="fa-p-2">
                                        {/* Grouping Logic could be added here */}
                                        <div className="fa-px-3 fa-py-2 fa-text-xs fa-font-semibold fa-text-slate-400 fa-uppercase">Top Results</div>
                                        
                                        {results.map((result) => (
                                            <button
                                                key={result.id}
                                                onClick={() => handleNavigate(result.url)}
                                                className="fa-w-full fa-flex fa-items-center fa-gap-3 fa-px-3 fa-py-3 fa-rounded-lg hover:fa-bg-indigo-50 dark:hover:fa-bg-indigo-900/20 fa-group fa-transition-colors"
                                            >
                                                <div className="fa-p-2 fa-rounded-md fa-bg-slate-100 dark:fa-bg-slate-800 group-hover:fa-bg-white dark:group-hover:fa-bg-slate-700 fa-text-slate-500 dark:fa-text-slate-400 group-hover:fa-text-indigo-600">
                                                    <Icon icon={result.category === 'Menu' ? 'heroicons:list-bullet' : 'heroicons:document-text'} className="fa-w-5 fa-h-5" />
                                                </div>
                                                <div className="fa-flex-1 fa-text-left">
                                                    <p className="fa-text-sm fa-font-medium fa-text-slate-700 dark:fa-text-slate-200 group-hover:fa-text-indigo-700 dark:group-hover:fa-text-indigo-400">
                                                        {result.title}
                                                    </p>
                                                    <p className="fa-text-xs fa-text-slate-500">
                                                        {result.category}
                                                    </p>
                                                </div>
                                                <Icon icon="heroicons:chevron-right" className="fa-w-4 fa-h-4 fa-text-slate-300 group-hover:fa-text-indigo-400" />
                                            </button>
                                        ))}
                                    </div>
                                ) : query.length > 1 ? (
                                    <div className="fa-p-12 fa-text-center">
                                        <Icon icon="heroicons:magnifying-glass" className="fa-w-12 fa-h-12 fa-mx-auto fa-text-slate-300 fa-mb-3" />
                                        <p className="fa-text-slate-900 dark:fa-text-white fa-font-medium">No results found</p>
                                        <p className="fa-text-sm fa-text-slate-500">We couldn't find anything matching "{query}"</p>
                                    </div>
                                ) : (
                                    <div className="fa-p-12 fa-text-center">
                                        <p className="fa-text-sm fa-text-slate-400">Type something to start searching...</p>
                                    </div>
                                )}
                            </div>

                            {/* Footer Hints */}
                            <div className="fa-px-4 fa-py-3 fa-bg-slate-50 dark:fa-bg-slate-800/50 fa-border-t fa-border-slate-100 dark:fa-border-slate-800 fa-flex fa-items-center fa-justify-between fa-text-xs fa-text-slate-500">
                                <div className="fa-flex fa-gap-4">
                                    <span className="fa-flex fa-items-center"><kbd className="fa-font-sans fa-bg-white dark:fa-bg-slate-700 fa-border fa-border-slate-200 dark:fa-border-slate-600 fa-rounded fa-px-1.5 fa-mr-1">↵</kbd> to select</span>
                                    <span className="fa-flex fa-items-center"><kbd className="fa-font-sans fa-bg-white dark:fa-bg-slate-700 fa-border fa-border-slate-200 dark:fa-border-slate-600 fa-rounded fa-px-1.5 fa-mr-1">↑↓</kbd> to navigate</span>
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