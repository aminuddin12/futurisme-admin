/**
 * Memformat nama modul dari format package composer ke nama tampilan yang cantik.
 * Contoh: 'aminuddin12/futurisme-admin' -> 'Fu Admin'
 */
export const formatModuleName = (pluginName: string | null): string => {
    if (!pluginName) return 'General';

    // Ambil bagian setelah slash "/"
    const namePart = pluginName.split('/').pop() || pluginName;

    // Ganti 'futurisme-' dengan 'Fu ' untuk branding, atau hapus dash
    let formatted = namePart
        .replace('futurisme-', 'Fu ')
        .replace(/-/g, ' ');

    // Capitalize setiap kata
    return formatted.replace(/\b\w/g, (l) => l.toUpperCase());
};

/**
 * Memformat key database menjadi Label yang mudah dibaca.
 * Contoh: 'auth.can_register' -> 'Visitor Can Register'
 * Contoh: 'site_name' -> 'Site Name'
 */
export const formatSettingKey = (key: string): string => {
    // Hapus prefix group umum jika ada (opsional)
    let label = key;

    // Ganti titik dan underscore dengan spasi
    label = label.replace(/[._]/g, ' ');

    // Khusus untuk auth., kita buat lebih deskriptif jika perlu
    if (label.startsWith('auth ')) {
        label = label.replace('auth ', '');
    }

    // Capitalize Words
    return label.replace(/\b\w/g, (l) => l.toUpperCase());
};