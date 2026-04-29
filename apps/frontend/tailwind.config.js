/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'k-black':  '#080808',
        'k-black2': '#111111',
        'k-black3': '#1a1a1a',
        'k-red':    '#D42B2B',
        'k-white':  '#F5F5F5',
        'k-muted':  '#888888',
        'k-border': '#242424',
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
