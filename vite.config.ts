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
                // HAPUS -[hash] agar nama file tetap (app.js / app.css)
                // Ini penting agar bisa dipanggil manual via asset() di blade tanpa manifest parsing yang rumit
                entryFileNames: 'assets/[name].js',
                chunkFileNames: 'assets/[name].js',
                assetFileNames: 'assets/[name].[ext]',
            },
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src/Resources/js'),
        },
    },
});