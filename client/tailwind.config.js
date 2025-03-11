import flowbite from "flowbite/plugin";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      'mobile': '350px',
      'pc': '1024px',
    },
    extend: {
      colors: {
        primary:{
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
    },
  },
  plugins: [
    flowbite, 
  ],
}