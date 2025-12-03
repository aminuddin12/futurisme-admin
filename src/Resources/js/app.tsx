import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
// Import Ziggy
import { route as ziggyRoute } from 'ziggy-js';

const appName = 'Futurisme Admin';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        const pages = import.meta.glob('./Pages/**/*.tsx');
        const path = `./Pages/${name}.tsx`;

        if (!pages[path]) {
            console.error(`❌ [Futurisme] Page not found: ${path}`);
        }

        return resolvePageComponent(path, pages);
    },
    setup({ el, App, props }) {
        // Ambil Ziggy Config dari Props
        // @ts-ignore
        const ziggyConfig = props.initialPage.props.ziggy;
        
        // LOG PROPS UNTUK DEBUGGING
        console.log('[Futurisme] App Initialized. Props:', props.initialPage.props);

        // Setup Global Route Helper
        if (typeof window !== 'undefined') {
            // @ts-ignore
            window.route = (name, params, absolute, config) => {
                // Gunakan config dari props sebagai prioritas utama
                // @ts-ignore
                const configToUse = config || ziggyConfig || window.Ziggy;

                // Jika routes kosong/tidak ada, jangan panggil ziggyRoute (karena akan error)
                // Kembalikan string kosong atau nama route sebagai fallback
                if (!configToUse || !configToUse.routes || Object.keys(configToUse.routes).length === 0) {
                    // console.warn('[Futurisme] Ziggy routes missing. Using manual fallback.');
                    
                    // Mocking behavior sederhana untuk .current() agar tidak crash
                    if (!name) {
                         return { 
                             current: () => undefined,
                             has: () => false 
                         }; 
                    }
                    return undefined;
                }
                
                // @ts-ignore
                return ziggyRoute(name, params, absolute, configToUse);
            };
        }

        const root = createRoot(el);
        root.render(<App {...props} />);
    },
});