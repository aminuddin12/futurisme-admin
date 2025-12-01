import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            // Path relatif terhadap root paket
            input: ['src/Resources/css/app.css', 'src/Resources/js/app.tsx'],
            // Folder output build (akan dipublish ke user nanti)
            buildDirectory: 'vendor/futurisme-admin',
            // Refresh path
            refresh: ['src/Resources/views/**'],
        }),
        react(),
    ],
    build: {
        // Output ke folder public paket
        outDir: 'public/vendor/futurisme-admin',
        emptyOutDir: true,
        manifest: true,
        rollupOptions: {
            output: {
                // Hashing nama file agar unik
                entryFileNames: 'assets/[name]-[hash].js',
                chunkFileNames: 'assets/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash].[ext]',
            },
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src/Resources/js'),
        },
    },
});
