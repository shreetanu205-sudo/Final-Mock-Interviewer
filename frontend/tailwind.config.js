/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FFF7F0',
        plum: {
          DEFAULT: '#24102F',
          dark: '#180B20',
          light: '#361845'
        },
        orbit: {
          purple: '#713B91',
          lavender: '#D9C4F2',
          peach: '#FFB79D',
          mint: '#CBE8D6',
          muted: '#81758A',
          cream: '#FFF7F0'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'Cambria', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(36, 16, 47, 0.05), 0 2px 6px -1px rgba(36, 16, 47, 0.03)',
        'medium': '0 10px 30px -4px rgba(36, 16, 47, 0.08), 0 4px 12px -2px rgba(36, 16, 47, 0.04)',
        'elevated': '0 20px 40px -8px rgba(36, 16, 47, 0.12), 0 8px 16px -4px rgba(36, 16, 47, 0.06)',
      }
    },
  },
  plugins: [],
}
