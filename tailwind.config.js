/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#f0f4ff',
          100: '#e0eaff',
          200: '#c7d7fe',
          300: '#a5b8fc',
          400: '#8190f8',
          500: '#6366f1',
          600: '#4d4ec8',
          700: '#1b2d5f',
          800: '#162348',
          900: '#0f1a36',
          950: '#080d1e',
        },
        navy: {
          DEFAULT: '#162550',
          light:   '#1e3270',
          dark:    '#0e1932',
        },
        gold: {
          DEFAULT: '#f5a623',
          light:   '#ffc34d',
          dark:    '#d4880a',
        },
      },
      animation: {
        'fade-in':     'fadeIn 0.3s ease-out',
        'slide-up':    'slideUp 0.4s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
      },
      keyframes: {
        fadeIn:     { '0%': { opacity: '0' },                     '100%': { opacity: '1' } },
        slideUp:    { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideRight: { '0%': { opacity: '0', transform: 'translateX(-16px)' },'100%': { opacity: '1', transform: 'translateX(0)' } },
      },
      boxShadow: {
        card:  '0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)',
        hover: '0 4px 12px rgba(0,0,0,0.12), 0 8px 32px rgba(0,0,0,0.08)',
        glow:  '0 0 20px rgba(245,166,35,0.35)',
      },
    },
  },
  plugins: [],
}
