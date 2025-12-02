import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
// Import Ziggy agar fungsi route() tersedia
import { route } from 'ziggy-js';

// Setup Global Route Helper untuk React Components
if (typeof window !== 'undefined') {
    window.route = route;
}

const appName = 'Futurisme Admin';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        // Log ini akan muncul jika App.tsx PAKET yang berjalan
        console.log(`🔍 [Futurisme] Resolving page: ${name}`);

        const pages = import.meta.glob('./Pages/**/*.tsx');
        const path = `./Pages/${name}.tsx`;

        if (!pages[path]) {
            console.error(`❌ [Futurisme] Page not found in package: ${path}`);
            console.log('📂 Available pages:', Object.keys(pages));
        }

        return resolvePageComponent(path, pages);
    },
    setup({ el, App, props }) {
        // Log tanda sukses booting
        console.log('✅ [Futurisme] Admin App Booting...');
        
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
});