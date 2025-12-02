/** @type {import('tailwindcss').Config} */
export default {
    // Prefix penting agar class tidak bentrok dengan aplikasi utama
    // Contoh penggunaan: class="fa-bg-red-500 fa-p-4"
    prefix: 'fa-',
    content: [
        './src/Resources/**/*.blade.php',
        './src/Resources/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                // Warna custom
                brand: '#6366f1',
            }
        },
    },
    plugins: [require('@tailwindcss/forms')],
};