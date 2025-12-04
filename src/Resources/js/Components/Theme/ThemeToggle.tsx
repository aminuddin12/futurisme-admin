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
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    p-2 rounded-full transition-all border
                    ${isOpen 
                        // PERBAIKAN: Pastikan semua class menggunakan prefix '' dengan benar
                        // Varian seperti dark: dan hover: harus diikuti prefix ''
                        ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900' 
                        : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 border-transparent'}
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
                        // PERBAIKAN: Tambahkan '' setelah 'dark:' pada semua class container dropdown
                        className="absolute right-0 mt-2 w-36 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden z-50 py-1"
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
                                    w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors
                                    ${theme === item.value 
                                        // PERBAIKAN: Tambahkan '' setelah 'dark:' dan 'hover:' pada item dropdown
                                        ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' 
                                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'}
                                `}
                            >
                                <Icon icon={item.icon} className="w-4 h-4" />
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}