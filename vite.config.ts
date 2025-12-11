import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

export default defineConfig(({ mode }) => {
    const hostPath = path.resolve(__dirname, '../../../'); 
    
    const buildPath = 'public/vendor/futurisme-admin';

    console.log(`   📂 Build Output: ${buildPath} (Package Local)`);

    return {
        plugins: [
            laravel({
                input: [
                    'src/Resources/css/app.css', 
                    'src/Resources/js/app.tsx'
                ],
                buildDirectory: 'vendor/futurisme-admin',
                refresh: ['src/Resources/views/**'],
                hotFile: path.join(hostPath, 'public/vendor/futurisme-admin/hot'),
            }),
            react(),
        ],
        build: {
            outDir: buildPath, 
            emptyOutDir: true,
            manifest: true,
            minify: 'terser',
            terserOptions: {
                compress: {
                    drop_console: true,
                    drop_debugger: true,
                    pure_funcs: ['console.log', 'console.info', 'console.warn'],
                    passes: 2, 
                },
                mangle: true,
                format: {
                    comments: false,
                },
            },
            rollupOptions: {
                output: {
                    entryFileNames: 'assets/[hash].js',
                    chunkFileNames: 'assets/[hash].js',
                    assetFileNames: 'assets/[hash].[ext]',
                    manualChunks: (id) => {
                        if (id.includes('node_modules')) {
                            return 'vendor';
                        }
                    },
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