import { ReactNode } from 'react';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import ThemeToggle from '../Components/Theme/ThemeToggle';
import LogoDefault from '../Components/LogoDefault';

interface Props {
    children: ReactNode;
    title?: string;
    maxWidth?: string; // Prop untuk fleksibilitas lebar
}

export default function FaPublicLayout({ children, title, maxWidth = 'max-w-[1920px]' }: Props) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 selection:bg-indigo-500 selection:text-white font-sans flex flex-col">
            <Head title={title} />

            {/* Background Pattern yang lebih halus */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-40 dark:opacity-20"
                 style={{ 
                     backgroundImage: 'radial-gradient(#6366f1 0.5px, transparent 0.5px)', 
                     backgroundSize: '24px 24px' 
                 }}
            />

            {/* Top Bar */}
            <header className="relative z-20 w-full px-4 sm:px-6 py-4 flex justify-between items-center max-w-[1920px] mx-auto">
                <div className="flex items-center gap-2">
                    <LogoDefault className="h-8 w-auto" iconClassName="w-8 h-8" textClassName="text-lg" />
                </div>
                <div>
                    <ThemeToggle />
                </div>
            </header>

            {/* Main Content Area */}
            {/* PERBAIKAN: 
                1. Mengurangi padding vertikal/horizontal agar konten lebih mepet tepi.
                2. Menambahkan w-full pada main agar flex container mengambil lebar penuh.
            */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-6 w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    // PERBAIKAN: Default maxWidth diubah ke max-w-[1920px] dan ditambah mx-auto
                    className={`w-full ${maxWidth} mx-auto`} 
                >
                    {children}
                </motion.div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 py-6 text-center text-sm text-slate-400 dark:text-slate-600">
                <p>&copy; {new Date().getFullYear()} Futurisme Ecosystem. All rights reserved.</p>
            </footer>
        </div>
    );
}