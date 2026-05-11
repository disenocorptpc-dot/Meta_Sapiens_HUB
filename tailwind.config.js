/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0F1117',
        card: '#1A1D27',
        accent: '#6C63FF',
        'accent-hover': '#5A52E0',
        'text-main': '#F0F0F0',
        'text-sec': '#9CA3AF',
        border: '#2A2D3A',
        danger: '#FF4757',
        warning: '#FFA502',
        success: '#2ED573',
        info: '#1E90FF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
