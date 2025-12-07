import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'src/Resources/css/app.css', 
                'src/Resources/js/app.tsx'
            ],
            buildDirectory: 'vendor/futurisme-admin',
            refresh: ['src/Resources/views/**'],
        }),
        react(),
    ],
    build: {
        outDir: 'public/vendor/futurisme-admin', 
        emptyOutDir: true,
        manifest: true,
        rollupOptions: {
            output: {
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