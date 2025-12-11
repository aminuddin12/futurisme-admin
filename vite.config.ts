import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

export default defineConfig(({ mode }) => {
    const hostPath = path.resolve(__dirname, '../../../../');
    const isMonorepoDev = fs.existsSync(path.join(hostPath, 'artisan'));
    const buildPath = isMonorepoDev 
        ? path.join(hostPath, 'public/vendor/futurisme-admin') 
        : 'public/vendor/futurisme-admin';

    return {
        plugins: [
            laravel({
                input: [
                    'src/Resources/css/app.css', 
                    'src/Resources/js/app.tsx'
                ],
                buildDirectory: 'vendor/futurisme-admin',
                refresh: ['src/Resources/views/**'],
                hotFile: isMonorepoDev 
                    ? path.join(hostPath, 'public/vendor/futurisme-admin/hot')
                    : 'public/vendor/futurisme-admin/hot',
            }),
            react(),
        ],
        build: {
            outDir: buildPath, 
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
        server: {
            fs: {
                allow: [
                    path.resolve(__dirname),
                    path.resolve(hostPath),
                ]
            }
        }
    };
});