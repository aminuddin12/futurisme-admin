import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: ['src/Resources/css/app.css', 'src/Resources/js/app.tsx'],
            buildDirectory: 'vendor/futurisme-admin',
            refresh: ['src/Resources/views/**'],
        }),
        react(),
    ],
    build: {
        outDir: 'public/vendor/futurisme-admin',
        emptyOutDir: true,
        manifest: true, // Wajib true agar kita bisa baca mapping file-nya
        rollupOptions: {
            output: {
                // KITA KEMBALIKAN KE DEFAULT (DENGAN HASH)
                // Hapus entryFileNames yang statis agar Vite otomatis kasih hash
                // entryFileNames: 'assets/[name].js', <-- Hapus/Komentar ini
                // chunkFileNames: 'assets/[name].js', <-- Hapus/Komentar ini
                // assetFileNames: 'assets/[name].[ext]', <-- Hapus/Komentar ini
                
                // Atau set eksplisit dengan hash:
                entryFileNames: 'assets/[name]-[hash].js',
                chunkFileNames: 'assets/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash].[ext]',
                
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('react') || id.includes('react-dom')) {
                            return 'vendor-react';
                        }
                        if (id.includes('framer-motion') || id.includes('@iconify')) {
                            return 'vendor-ui';
                        }
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
});