import flowbite from "flowbite/plugin";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      'mobile': '350px',
      'tab':'750px',
      'pc': '1024px',
    },
    extend: {
      colors: {
        primary:{
          50:'#fefce8b9',
          100:'#82350c',
          600:'#E46300FF',
          700:'#cc5002',
        },
        secondary: '#451805',
        paysparq: '#FCEDD4',
        text: '#ffffff',
        dash: '#ffc76d',
        borrow: '#0f172a',
        pay: '#fff9ec'
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        interM: ['Inter-Medium', 'sans-serif'],
        interB: ['Inter-Bold', 'sans-serif'],
        interSB: ['Inter-SemiBold', 'sans-serif'],
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        },
      },
      animation: {
        wiggle: 'wiggle 0.3s ease-in-out',
      },
    },
  },
  plugins: [
    flowbite,
  ],
}