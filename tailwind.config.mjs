/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        /* Light mode colors */
        'primary': '#562135',       /* Deep burgundy */
        'secondary': '#c3829e',     /* Mauve pink */
        'accent': '#e9b1cd',        /* Light pink */
        'background': '#ffe7de',    /* Pale peach */
        'text': '#562135',          /* Deep burgundy for text */
        'highlight': '#fcd1d7',     /* Soft pink */
        'window': '#ffe7de',        /* Pale peach for window background */
        'window-content': '#fcd1d7', /* Soft pink for window content */

        /* Dark mode colors */
        'primary-dark': '#505477',  /* Dark blue-purple */
        'secondary-dark': '#616c99', /* Medium blue-purple */
        'accent-dark': '#fcddf2',   /* Light pink */
        'background-dark': '#505477', /* Dark blue-purple */
        'text-dark': '#ffdede',     /* Light pink-peach for dark mode text */
        'highlight-dark': '#ffc2c2', /* Salmon pink */
        'window-dark': '#505477',   /* Dark blue-purple for window background */
        'window-content-dark': '#505477', /* Dark blue-purple for window content */
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'window-open': 'windowOpen 0.5s forwards',
        'window-close': 'windowClose 0.4s forwards',
        'ripple': 'ripple 0.6s linear',
        'rotate': 'rotate 0.5s ease-in-out',
        'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
        'confetti-fall': 'confetti-fall 2s ease-in-out forwards',
        'fade-in': 'fadeIn 0.5s ease forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        windowOpen: {
          '0%': { opacity: '0', transform: 'scale(0.8) translateY(20px)' },
          '70%': { transform: 'scale(1.05) translateY(-5px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        windowClose: {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.8) translateY(20px)' },
        },
        ripple: {
          'to': { transform: 'scale(4)', opacity: '0' },
        },
        rotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' },
        },
        'confetti-fall': {
          '0%': { transform: 'translateY(-50px) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100px) rotate(720deg)', opacity: '0' },
        },
        fadeIn: {
          'from': { opacity: '0', transform: 'translateY(10px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      fontFamily: {
        'comic': ['"Comic Sans MS"', '"Chalkboard SE"', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
