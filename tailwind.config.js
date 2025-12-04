/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
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