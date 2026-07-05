/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        lens: {
          navy: '#12110F',
          'navy-light': '#1A1816',
          'navy-lighter': '#252220',
          surface: '#1A1816',
          'surface-hover': '#252220',
          border: '#302C28',
          'border-light': '#443E38',
          blue: '#E8634A',
          'blue-light': '#F08C72',
          'blue-dark': '#C94D35',
          emerald: '#81B29A',
          'emerald-light': '#A7C7B8',
          violet: '#F2CC8F',
          'violet-light': '#F5DAAB',
          amber: '#D4883A',
          rose: '#E07A5F',
          cyan: '#5EAAA8',
          indigo: '#9C6B98',
        },
        coral: {
          400: '#F08C72',
          500: '#E8634A',
          600: '#C94D35',
        },
        sage: {
          400: '#A7C7B8',
          500: '#81B29A',
          600: '#6A9A82',
        },
        copper: {
          400: '#E0A05C',
          500: '#D4883A',
          600: '#B8722E',
        },
        terracotta: {
          400: '#EE9580',
          500: '#E07A5F',
          600: '#C96549',
        },
        plum: {
          400: '#B088AC',
          500: '#9C6B98',
          600: '#865880',
        },
      },
      borderRadius: {
        'lens-sm': '8px',
        'lens-md': '12px',
        'lens-lg': '16px',
        'lens-xl': '24px',
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(232, 99, 74, 0.3)',
        'glow-emerald': '0 0 20px rgba(129, 178, 154, 0.3)',
        'glow-violet': '0 0 20px rgba(242, 204, 143, 0.3)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.2)',
        'card-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.3)',
        'card-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #E8634A 0%, #F2CC8F 100%)',
        'gradient-success': 'linear-gradient(135deg, #81B29A 0%, #5EAAA8 100%)',
        'gradient-hero': 'linear-gradient(135deg, #12110F 0%, #2A1F1A 50%, #12110F 100%)',
        'gradient-card': 'linear-gradient(145deg, rgba(37, 34, 32, 0.5) 0%, rgba(26, 24, 22, 0.8) 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in-down': 'fadeInDown 0.6s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.6s ease-out forwards',
        'slide-in-right': 'slideInRight 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.4s ease-out forwards',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 3s ease infinite',
        'spin-slow': 'spin-slow 8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          from: { opacity: '0', transform: 'translateY(-20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          from: { opacity: '0', transform: 'translateX(-30px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(30px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(232, 99, 74, 0.2)' },
          '50%': { boxShadow: '0 0 25px rgba(232, 99, 74, 0.4)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
};
