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
        // Ambil Ziggy Config dari Props (dikirim dari HandleInertiaRequests middleware)
        // @ts-ignore
        const ziggyConfig = props.initialPage.props.ziggy;
        // @ts-ignore
        const siteName = props.initialPage.props.config?.site_name || 'Futurisme Admin';

        // Setup Global Route Helper
        if (typeof window !== 'undefined') {
            // @ts-ignore
            window.route = (name, params, absolute, config) => {
                // Gunakan config dari props, fallback ke window.Ziggy jika ada (misal dari blade)
                // @ts-ignore
                const configToUse = ziggyConfig || window.Ziggy;
                
                // @ts-ignore
                return ziggyRoute(name, params, absolute, configToUse);
            };
        }

        const root = createRoot(el);
        root.render(<App {...props} />);
    },
});