import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';

export type FlashType = 'success' | 'error' | 'warning' | 'info';

interface FlashMessageProps {
    message: string | null;
    type?: FlashType;
    duration?: number; // dalam ms, default 10000 (10 detik)
    onClose: () => void;
}

export default function FlashMessage({ 
    message, 
    type = 'success', 
    duration = 10000, 
    onClose 
}: FlashMessageProps) {
    const [progress, setProgress] = useState(100);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (!message) return;

        setProgress(100); // Reset progress saat pesan baru muncul
        
        const intervalTime = 100; // Update setiap 100ms
        const step = 100 / (duration / intervalTime);

        const timer = setInterval(() => {
            if (!isPaused) {
                setProgress((prev) => {
                    if (prev <= 0) {
                        clearInterval(timer);
                        onClose();
                        return 0;
                    }
                    return prev - step;
                });
            }
        }, intervalTime);

        return () => clearInterval(timer);
    }, [message, duration, isPaused, onClose]);

    // Konfigurasi Style dan Icon berdasarkan Tipe
    const config = {
        success: {
            bg: 'bg-white dark:bg-slate-800',
            border: 'border-green-500',
            icon: 'solar:check-circle-bold-duotone',
            iconColor: 'text-green-500',
            progress: 'bg-green-500',
            title: 'Success'
        },
        error: {
            bg: 'bg-white dark:bg-slate-800',
            border: 'border-red-500',
            icon: 'solar:danger-circle-bold-duotone',
            iconColor: 'text-red-500',
            progress: 'bg-red-500',
            title: 'System Notification'
        },
        warning: {
            bg: 'bg-white dark:bg-slate-800',
            border: 'border-amber-500',
            icon: 'solar:bell-bold-duotone',
            iconColor: 'text-amber-500',
            progress: 'bg-amber-500',
            title: 'Warning'
        },
        info: {
            bg: 'bg-white dark:bg-slate-800',
            border: 'border-indigo-500',
            icon: 'solar:info-circle-bold-duotone',
            iconColor: 'text-indigo-500',
            progress: 'bg-indigo-500',
            title: 'Information'
        }
    };

    const currentStyle = config[type];

    return (
        <AnimatePresence>
            {message && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed bottom-10 right-4 md:right-10 z-[100] max-w-sm w-full"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <div className={`
                        relative overflow-hidden rounded-2xl shadow-2xl 
                        ${currentStyle.bg} border-l-4 ${currentStyle.border}
                        backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95
                    `}>
                        <div className="p-4 flex items-start gap-3">
                            <div className={`shrink-0 ${currentStyle.iconColor} mt-0.5`}>
                                <Icon icon={currentStyle.icon} width="24" height="24" />
                            </div>
                            
                            <div className="flex-1 pt-0.5">
                                <h4 className="text-sm font-bold text-slate-800 dark:text-white capitalize mb-1">
                                    {currentStyle.title}
                                </h4>
                                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                    {message}
                                </p>
                            </div>

                            <button 
                                onClick={onClose}
                                className="shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                            >
                                <Icon icon="solar:close-circle-bold" width="20" height="20" />
                            </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-100 dark:bg-slate-700">
                            <motion.div 
                                className={`h-full ${currentStyle.progress}`}
                                initial={{ width: "100%" }}
                                animate={{ width: `${progress}%` }}
                                transition={{ ease: "linear", duration: 0.1 }}
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}