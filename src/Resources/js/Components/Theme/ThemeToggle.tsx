import { useRef, useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './ThemeContext';

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Mapping Icon Aktif di Header Button
    const getActiveIcon = () => {
        if (theme === 'light') return 'solar:sun-bold';
        if (theme === 'dark') return 'solar:moon-bold';
        return 'solar:monitor-bold';
    };

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="fa-relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    fa-p-2 fa-rounded-full fa-transition-all fa-border
                    ${isOpen 
                        // PERBAIKAN: Pastikan semua class menggunakan prefix 'fa-' dengan benar
                        // Varian seperti dark: dan hover: harus diikuti prefix 'fa-'
                        ? 'fa-bg-slate-100 dark:fa-bg-slate-800 fa-text-indigo-600 dark:fa-text-indigo-400 fa-border-indigo-100 dark:fa-border-indigo-900' 
                        : 'fa-text-slate-500 hover:fa-bg-slate-100 dark:hover:fa-bg-slate-800 fa-border-transparent'}
                `}
                title="Ubah Tema"
            >
                <Icon icon={getActiveIcon()} width="20" height="20" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                        // PERBAIKAN: Tambahkan 'fa-' setelah 'dark:' pada semua class container dropdown
                        className="fa-absolute fa-right-0 fa-mt-2 fa-w-36 fa-bg-white dark:fa-bg-slate-800 fa-rounded-xl fa-shadow-lg fa-border fa-border-slate-200 dark:fa-border-slate-700 fa-overflow-hidden fa-z-50 fa-py-1"
                    >
                        {[
                            { value: 'light', label: 'Light', icon: 'solar:sun-bold' },
                            { value: 'dark', label: 'Dark', icon: 'solar:moon-bold' },
                            { value: 'system', label: 'System', icon: 'solar:monitor-bold' },
                        ].map((item) => (
                            <button
                                key={item.value}
                                onClick={() => {
                                    setTheme(item.value as 'light' | 'dark' | 'system');
                                    setIsOpen(false);
                                }}
                                className={`
                                    fa-w-full fa-flex fa-items-center fa-gap-3 fa-px-4 fa-py-2 fa-text-sm fa-transition-colors
                                    ${theme === item.value 
                                        // PERBAIKAN: Tambahkan 'fa-' setelah 'dark:' dan 'hover:' pada item dropdown
                                        ? 'fa-text-indigo-600 dark:fa-text-indigo-400 fa-bg-indigo-50 dark:fa-bg-indigo-900/20' 
                                        : 'fa-text-slate-600 dark:fa-text-slate-300 hover:fa-bg-slate-50 dark:hover:fa-bg-slate-700/50'}
                                `}
                            >
                                <Icon icon={item.icon} className="fa-w-4 fa-h-4" />
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}