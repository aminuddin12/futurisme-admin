import { Icon } from '@iconify/react';
import LogoDefault from '../../Components/LogoDefault';
import './ArtWorkBackground.css';

export default function InstallationArtwork() {
    return (
        <div className="artwork-container relative w-full h-full min-h-[600px] overflow-hidden flex flex-col text-white">
            {/* Background Mesh */}
            <div className="artwork-mesh absolute inset-0 z-0"></div>

            {/* Version Badge (Top Right) */}
            <div className="absolute top-8 right-8 z-20">
                 <div className="flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-500/30 px-3 py-1.5 rounded-full backdrop-blur-md shadow-sm">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-xs font-semibold text-emerald-100 tracking-wide">v1.0.0-beta</span>
                </div>
            </div>
            
            {/* Content Wrapper */}
            <div className="relative z-10 flex flex-col justify-between h-full p-8 md:p-10">
                
                {/* Top Section */}
                <div className="flex-none mt-12"> {/* Added margin top to avoid overlap with badge if screen is small */}
                    <div className="w-12 h-1.5 bg-indigo-500 rounded-full mb-6 shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
                    <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight leading-tight mb-4 drop-shadow-sm">
                        Build Faster.<br />
                        Scale Better.
                    </h1>
                    <p className="text-indigo-100/80 text-base xl:text-lg max-w-sm leading-relaxed font-light">
                        Futurisme Admin provides a robust foundation for your next big idea.
                    </p>
                </div>

                {/* Illustration / Center Piece - Made Wider & Better Proportioned */}
                <div className="flex-1 flex items-center justify-center py-8 my-4">
                    <div className="glass-card p-6 rounded-2xl w-full max-w-sm transform rotate-2 hover:rotate-0 transition-all duration-500 shadow-2xl hover:shadow-indigo-500/20 border border-white/10 group">
                        {/* Browser Dots */}
                        <div className="flex items-center gap-2 mb-5 border-b border-white/5 pb-4">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-400 shadow-sm"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-green-400 shadow-sm"></div>
                            <div className="ml-2 h-2 w-20 bg-white/5 rounded-full"></div>
                        </div>
                        
                        {/* Abstract UI Content */}
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <div className="w-1/3 h-24 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/5 animate-pulse"></div>
                                <div className="w-2/3 space-y-3">
                                    <div className="h-2 w-full bg-white/10 rounded-full"></div>
                                    <div className="h-2 w-3/4 bg-white/10 rounded-full"></div>
                                    <div className="h-2 w-1/2 bg-white/10 rounded-full"></div>
                                    <div className="h-10 w-full mt-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                                        <Icon icon="solar:graph-new-bold-duotone" className="text-indigo-300 w-6 h-6" />
                                    </div>
                                </div>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full"></div>
                            <div className="flex justify-between gap-2">
                                <div className="h-2 w-1/3 bg-white/5 rounded-full"></div>
                                <div className="h-2 w-1/3 bg-white/5 rounded-full"></div>
                                <div className="h-2 w-1/3 bg-white/5 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section - Updated Layout */}
                <div className="flex-none pt-6 border-t border-white/10">
                    <div className="flex flex-col sm:flex-row items-end justify-between gap-4">
                        
                        {/* Left: Logo & Credits */}
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                            <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-md shadow-lg border border-white/5 shrink-0">
                                <LogoDefault 
                                    textClassName="hidden" 
                                    iconClassName="w-6 h-6 text-white" 
                                />
                            </div>
                            <div className="text-xs text-indigo-200/90 leading-relaxed font-light">
                                <p className="mb-1">
                                    Created by <a href="https://github.com/aminuddin12" target="_blank" rel="noreferrer" className="font-semibold text-white hover:text-indigo-300 transition-colors underline decoration-indigo-400/50 underline-offset-2">Aminuddinadl</a> with MIT License.
                                </p>
                                <p className="flex flex-wrap items-center gap-x-1">
                                    If you like my project, you can buy me a 
                                    <span className="inline-flex items-center text-amber-300 font-medium bg-amber-900/30 px-1.5 py-0.5 rounded text-[10px]">
                                        coffee <Icon icon="solar:cup-hot-bold" className="ml-1" />
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* Right: Social Icons - Aligned to right/end */}
                        <div className="flex items-center gap-2 shrink-0">
                            <SocialIcon icon="mdi:github" href="#" />
                            <SocialIcon icon="mdi:instagram" href="#" />
                            <SocialIcon icon="mdi:facebook" href="#" />
                            <SocialIcon icon="mdi:twitter" href="#" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SocialIcon({ icon, href }: { icon: string, href: string }) {
    return (
        <a 
            href={href} 
            className="p-2 rounded-lg bg-white/5 hover:bg-white/20 text-white/60 hover:text-white transition-all duration-300 border border-transparent hover:border-white/10 hover:shadow-lg hover:-translate-y-0.5"
        >
            <Icon icon={icon} width="18" height="18" />
        </a>
    );
}