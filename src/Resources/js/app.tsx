import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
// Import Ziggy
import { route as ziggyRoute } from 'ziggy-js';

// Setup Global Route Helper
if (typeof window !== 'undefined') {
    // Fungsi wrapper untuk route global
    // @ts-ignore
    window.route = (name, params, absolute, config) => {
        // @ts-ignore
        const ziggy = window.Ziggy;
        
        // @ts-ignore
        return ziggyRoute(name, params, absolute, ziggy);
    };
}

const appName = 'Futurisme Admin';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        // console.log(`🔍 [Futurisme] Resolving page: ${name}`); 
        const pages = import.meta.glob('./Pages/**/*.tsx');
        const path = `./Pages/${name}.tsx`;

        if (!pages[path]) {
            console.error(`❌ [Futurisme] Page not found: ${path}`);
        }

        return resolvePageComponent(path, pages);
    },
    setup({ el, App, props }) {
        // Cek apakah Ziggy sudah siap
        // @ts-ignore
        if (!window.Ziggy || Object.keys(window.Ziggy.routes).length === 0) {
             console.warn('[Futurisme] Ziggy routes are empty. Make sure php artisan route:clear has been run.');
        } else {
             // console.log('✅ [Futurisme] Ziggy loaded with ' + Object.keys(window.Ziggy.routes).length + ' routes.');
        }

        const root = createRoot(el);
        root.render(<App {...props} />);
    },
});