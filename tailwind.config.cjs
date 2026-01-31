/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // A unique "Dusty Indigo" palette
        slate: {
          50: '#F4F4F9',
          100: '#E4E4EE',
          200: '#CBCBDD',
          300: '#AEAECB',
          400: '#9292BA',
          500: '#7575A3',
          600: '#5C5C85',
          700: '#464666',
          800: '#32324A',
          900: '#212130', // <-- Sidebar becomes this cool "Nightshade"
          950: '#15151F',
        }
      },
    },
  },
  plugins: [],
}