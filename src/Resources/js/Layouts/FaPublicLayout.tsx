import { ReactNode } from 'react';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';

interface Props {
    children: ReactNode;
    title?: string;
    maxWidth?: string; // Prop untuk fleksibilitas lebar
}

export default function FaPublicLayout({ children, title, maxWidth = 'max-w-[1920px]' }: Props) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 selection:bg-indigo-500 selection:text-white font-sans flex flex-col overflow-hidden">
            <Head title={title} />

            <div className="fixed inset-0 z-0 pointer-events-none opacity-40 dark:opacity-20"
                 style={{ 
                     backgroundImage: 'radial-gradient(#6366f1 0.5px, transparent 0.5px)', 
                     backgroundSize: '24px 24px' 
                 }}
            />

            {/* Main Content Area - Full Screen without Header/Footer */}
            <main className="relative z-10 flex-1 flex flex-col w-full h-screen overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className={`w-full h-full ${maxWidth} mx-auto px-2 py-2 lg:px-1 lg:py-1`} 
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
}