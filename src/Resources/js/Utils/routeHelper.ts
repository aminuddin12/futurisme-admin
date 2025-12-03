/**
 * Helper SUPER AMAN untuk route (Defensive Coding)
 * Mencegah crash jika Ziggy belum siap atau route tidak ditemukan.
 */
export const safeRoute = (name: string, fallbackUrl: string): string => {
    try {
        // @ts-ignore
        if (typeof window.route !== 'function') {
            // console.warn('[Futurisme] window.route function is missing.');
            return fallbackUrl;
        }

        // @ts-ignore
        // Langsung coba panggil route() sebagai object global
        const r: any = window.route();

        // Cek hasil panggilannya valid & punya method .has()
        if (r && typeof r.has === 'function') {
            if (r.has(name)) {
                // @ts-ignore
                return window.route(name);
            } else {
                // console.warn(`[Futurisme] Route '${name}' not found in Ziggy list.`);
            }
        }
    } catch (e) {
        // Silent fail
    }
    return fallbackUrl;
};

/**
 * Helper untuk mengecek apakah route sedang aktif
 */
export const isRouteActive = (name: string): boolean => {
    try {
        // @ts-ignore
        if (typeof window.route === 'function') {
             // @ts-ignore
             const r: any = window.route();
             if (r && typeof r.current === 'function') {
                 return r.current(name);
             }
        }
    } catch (e) { return false; }
    return false;
};