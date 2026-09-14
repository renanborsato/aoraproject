/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#FFA001',
        secondary: '#FF9C01',
        background: '#161622',
        accent: '#CDCDE0',
      },
      fontFamily: {
        regular: ['System'],
        bold: ['System'],
        nabla: ['Nabla'],
      },
    },
  },
  plugins: [],
};