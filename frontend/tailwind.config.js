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
          DEFAULT: '#0F172A',
          dark: '#020617',
          light: '#334155',
        },
        secondary: {
          DEFAULT: '#1E293B',
          dark: '#0F172A',
          light: '#475569',
        },
        accent: {
          DEFAULT: '#14B8A6',
          dark: '#0D9488',
          light: '#2DD4BF',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        brandBg: {
          light: '#F8FAFC',
          dark: '#0B0F19',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        premium: '0 10px 30px -10px rgba(15, 23, 42, 0.08)',
        glow: '0 0 20px rgba(20, 184, 166, 0.15)',
      }
    },
  },
  plugins: [],
}
