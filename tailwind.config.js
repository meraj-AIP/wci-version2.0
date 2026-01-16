/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6e9f2',
          100: '#ccd3e5',
          200: '#99a7cb',
          300: '#667bb1',
          400: '#334f97',
          500: '#001a72', // Main primary color
          600: '#00155b',
          700: '#001044',
          800: '#000a2d',
          900: '#000516',
        },
        secondary: {
          50: '#fff0e9',
          100: '#ffe1d3',
          200: '#ffc3a7',
          300: '#ffa57b',
          400: '#ff874f',
          500: '#ff6720', // Main secondary color
          600: '#cc521a',
          700: '#993e13',
          800: '#66290d',
          900: '#331506',
        },
      },
      fontFamily: {
        sans: ['proxima_novamedium', 'Proxima Nova', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'scan': 'scan 2s linear infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255, 103, 32, 0.4)' },
          '50%': { boxShadow: '0 0 20px 4px rgba(255, 103, 32, 0.2)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
    },
  },
  plugins: [],
}
