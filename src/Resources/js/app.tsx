import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
// Import Ziggy
import { route as ziggyRoute } from 'ziggy-js';
// Import ThemeProvider
import { ThemeProvider } from './Components/Theme/ThemeContext';

createInertiaApp({
    title: (title) => `${title}`,
    resolve: (name) => {
        const pages = import.meta.glob('./Pages/**/*.tsx');
        const path = `./Pages/${name}.tsx`;

        if (!pages[path]) {
            console.error(`❌ [Futurisme] Page not found: ${path}`);
        }

        return resolvePageComponent(path, pages);
    },
    setup({ el, App, props }) {
        // @ts-ignore
        const ziggyConfig = props.initialPage.props.ziggy;

        // Setup Global Route Helper
        if (typeof window !== 'undefined') {
            // @ts-ignore
            window.route = (name, params, absolute, config) => {
                // @ts-ignore
                const configToUse = config || ziggyConfig || window.Ziggy;
                if (!configToUse || !configToUse.routes || Object.keys(configToUse.routes).length === 0) {
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
        root.render(
            <ThemeProvider defaultTheme="system" storageKey="futurisme-theme">
                <App {...props} />
            </ThemeProvider>
        );
    },
});