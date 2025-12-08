import { useState, useRef, useEffect } from 'react';
import { useTheme } from './ThemeContext';
import { Icon } from '@iconify/react';
import { usePage } from '@inertiajs/react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

export default function ThemeToggle({ className = '' }: { className?: string }) {
    const { config } = usePage().props as any;
    const isAutoDarkMode = config?.theme_auto_dark_mode == 1;

    const { theme, setTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (isAutoDarkMode) return null;

    const getCurrentIcon = () => {
        if (theme === 'dark') return "solar:moon-bold-duotone";
        if (theme === 'light') return "solar:sun-bold-duotone";
        return "solar:monitor-bold-duotone";
    };

    const options = [
        { value: 'light', label: 'Light', icon: 'solar:sun-bold-duotone', activeClass: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' },
        { value: 'dark', label: 'Dark', icon: 'solar:moon-bold-duotone', activeClass: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' },
        { value: 'system', label: 'System', icon: 'solar:monitor-bold-duotone', activeClass: 'text-gray-600 bg-gray-100 dark:text-gray-300 dark:bg-gray-700' },
    ];

    const menuVariants: Variants = {
        hidden: { 
            opacity: 0, 
            y: -8, 
            scale: 0.96,
            transition: { duration: 0.15, ease: "easeInOut" }
        },
        visible: { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: { type: "spring", stiffness: 400, damping: 25 }
        },
        exit: { 
            opacity: 0, 
            y: -8, 
            scale: 0.96,
            transition: { duration: 0.1, ease: "easeOut" }
        }
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileTap={{ scale: 0.95 }}
                className={`
                    w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200
                    border outline-none
                    ${isOpen 
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-gray-700 dark:border-gray-600 dark:text-indigo-400' 
                        : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200'}
                `}
            >
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={theme}
                        initial={{ scale: 0.5, opacity: 0, rotate: -30 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={{ scale: 0.5, opacity: 0, rotate: 30 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Icon icon={getCurrentIcon()} className="w-5 h-5" />
                    </motion.div>
                </AnimatePresence>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        variants={menuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute right-0 top-12 w-48 p-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 z-50 overflow-hidden ring-1 ring-black/5"
                    >
                        {options.map((option) => {
                            const isActive = theme === option.value;
                            return (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        setTheme(option.value as 'light' | 'dark' | 'system');
                                        setIsOpen(false);
                                    }}
                                    className={`
                                        w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 mb-1 last:mb-0
                                        ${isActive 
                                            ? option.activeClass 
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200'}
                                    `}
                                >
                                    <Icon 
                                        icon={option.icon} 
                                        className={`w-4.5 h-4.5 ${isActive ? '' : 'opacity-70'}`} 
                                    />
                                    <span>{option.label}</span>
                                    
                                    {isActive && (
                                        <motion.div 
                                            layoutId="check"
                                            className="ml-auto text-current"
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                        >
                                            <Icon icon="solar:check-circle-bold" className="w-4 h-4" />
                                        </motion.div>
                                    )}
                                </button>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}