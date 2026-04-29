/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'red': {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
        },
        'k-white': '#FFFFFF',
        'k-light-gray': '#FEF2F2',
        'k-gray': '#FEE2E2',
        'k-dark-gray': '#6B7280',
        'k-red': '#DC2626',
        'k-light-red': '#FCA5A5',
        'k-border': '#FEE2E2',
      },
      fontFamily: {
        'cormorant': ['"Cormorant Garamond"', 'Georgia', 'serif'],
        'dm':        ['"DM Sans"', 'system-ui', 'sans-serif'],
        'bebas':     ['"Bebas Neue"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}