/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        kuvsbook: {
          purple: '#802BB1',
          'dark-purple': '#2D283E',
          darker: '#1E1A25',
          'light-purple': '#564F6F'
        }
      }
    },
  },
  plugins: [],
};