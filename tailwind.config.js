/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette
        evergreen: '#164A41',       // headings, primary dark text
        teal: {
          DEFAULT: '#178C92',       // primary actions/icons
          deep: '#007078',          // hover states
          light: '#EAF4F1',         // subtle backgrounds
        },
        accent: {
          yellow: '#E7B83C',        // accents/status highlights
          beige: '#F8F4E1',         // dashboard background
          warmwhite: '#FFFDF5',     // cards/input surfaces
        },
        // Keep primary/secondary for legacy compatibility
        primary: {
          50: '#EAF4F1',
          100: '#d0eae8',
          200: '#a5d5d8',
          300: '#70bcbf',
          400: '#3da3a7',
          500: '#178C92',
          600: '#178C92',
          700: '#007078',
          800: '#0d5055',
          900: '#164A41',
        },
        secondary: {
          50: '#fefdf6',
          100: '#F8F4E1',
          200: '#f0e9c0',
          300: '#e7d99a',
          400: '#E7B83C',
          500: '#d4a030',
          600: '#b88928',
          700: '#96711f',
          800: '#755918',
          900: '#544010',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'Roboto', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      container: {
        center: true,
        padding: '1rem',
        screens: {
          sm: '100%',
          md: '100%',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1400px',
        },
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
