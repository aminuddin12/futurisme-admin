export {};

declare global {
    /**
     * Definisi manual untuk helper route() dari Ziggy.
     * Ini diperlukan agar TypeScript tidak error saat build package.
     */
    var route: {
        /**
         * Mengembalikan URL string untuk named route tertentu.
         */
        (name: string, params?: any, absolute?: boolean, config?: any): string;
        
        /**
         * Mengembalikan helper object untuk cek current route.
         * Contoh: route().current('dashboard')
         */
        (): { current(name?: string, params?: any): boolean };
    };
}