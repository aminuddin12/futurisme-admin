import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { usePage } from '@inertiajs/react';

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);
    const { auth } = usePage().props as any;

    useEffect(() => {
        const consent = localStorage.getItem('futurisme_cookie_consent');
        
        if (consent === 'denied') {
            window.location.href = '/';
            return;
        }

        if (consent === 'accepted') {
            executeTracking();
        } else {
            setIsVisible(true);
        }
    }, []);

    const executeTracking = async () => {
        try {
            const cookiesData = {
                screen_width: window.screen.width,
                screen_height: window.screen.height,
                color_depth: window.screen.colorDepth,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                language: navigator.language,
                cookies_enabled: navigator.cookieEnabled,
                connection: (navigator as any).connection ? (navigator as any).connection.effectiveType : 'unknown',
                history_length: window.history.length,
                timestamp: new Date().toISOString()
            };

            await fetch('/futurisme/track', {
                method: 'POST',
                keepalive: true,
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || ''
                },
                body: JSON.stringify({
                    url: window.location.href,
                    referrer: document.referrer,
                    cookies: cookiesData,
                    location: null 
                })
            });
        } catch (error) {
            console.error('Tracking failed', error);
        }
    };

    const handleAccept = () => {
        localStorage.setItem('futurisme_cookie_consent', 'accepted');
        setIsVisible(false);
        executeTracking();
    };

    const handleReject = () => {
        localStorage.setItem('futurisme_cookie_consent', 'denied');
        window.location.href = '/';
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
                >
                    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 flex flex-col md:flex-row items-center gap-6">
                        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
                            <Icon icon="lucide:cookie" className="w-8 h-8" />
                        </div>
                        
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                We value your privacy
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                We use cookies and advanced tracking technologies to enhance your experience, monitor system performance, and ensure security. 
                                By continuing, you agree to our data collection policies stored in our secure database.
                            </p>
                        </div>

                        <div className="flex gap-3 w-full md:w-auto">
                            <button
                                onClick={handleReject}
                                className="flex-1 md:flex-none px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors"
                            >
                                Decline & Exit
                            </button>
                            <button
                                onClick={handleAccept}
                                className="flex-1 md:flex-none px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 rounded-xl transition-colors"
                            >
                                Accept & Continue
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}