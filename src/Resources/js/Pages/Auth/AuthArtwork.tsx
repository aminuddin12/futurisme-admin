import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import '../Setup/ArtWorkBackground.css';

export default function AuthArtwork({ appName = 'Futurisme Admin' }: { appName?: string }) {
    return (
        <div className="artwork-container relative w-full h-full overflow-hidden flex flex-col text-white bg-slate-900">
            {/* Background Mesh Animation */}
            <div className="artwork-mesh absolute inset-0 z-0 opacity-60"></div>

            {/* Top Badge */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute top-8 right-8 z-20"
            >
                 <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md shadow-lg">
                    <Icon icon="solar:shield-check-bold" className="text-emerald-400 w-4 h-4" />
                    <span className="text-xs font-semibold text-gray-200 tracking-wide uppercase">Secure Area</span>
                </div>
            </motion.div>
            
            {/* Main Content */}
            <div className="relative z-10 flex flex-col justify-center h-full p-12 lg:p-16">
                
                {/* Typography */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mb-10"
                >
                    <div className="w-16 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-8 shadow-[0_0_20px_rgba(99,102,241,0.6)]"></div>
                    <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-tight mb-6 drop-shadow-xl text-white">
                        Welcome to <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-white">
                            {appName}
                        </span>
                    </h1>
                    <p className="text-gray-300 text-lg max-w-md leading-relaxed font-light">
                        Experience the next generation of admin management. Secure, fast, and fully customizable.
                    </p>
                </motion.div>

                {/* Abstract Visual Card */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="glass-card p-6 rounded-3xl w-full max-w-sm border border-white/10 shadow-2xl relative overflow-hidden group bg-white/5 backdrop-blur-xl"
                >
                    {/* Hover Glow Effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>

                    {/* Window Controls */}
                    <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4 relative z-10">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400/80"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80"></div>
                    </div>
                    
                    {/* Mock UI */}
                    <div className="space-y-4 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-700 flex items-center justify-center shadow-lg border border-white/10">
                                <Icon icon="solar:user-circle-bold-duotone" className="text-white w-6 h-6" />
                            </div>
                            <div className="space-y-2 flex-1">
                                <div className="h-2 w-20 bg-white/10 rounded-full"></div>
                                <div className="h-2 w-12 bg-white/5 rounded-full"></div>
                            </div>
                        </div>
                        
                        <div className="h-px w-full bg-white/5 my-2"></div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="h-16 rounded-xl bg-white/5 border border-white/5"></div>
                            <div className="h-16 rounded-xl bg-white/5 border border-white/5"></div>
                        </div>
                    </div>
                </motion.div>
            </div>
            
            {/* Footer */}
            <div className="absolute bottom-6 left-12 text-xs text-white/20 z-10">
                 System v1.0 &bull; Secure Encrypted Connection
            </div>
        </div>
    );
}