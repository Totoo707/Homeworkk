// filepath: c:\Users\thomas\Downloads\Apprentissage\my-app\tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}', // Add this line
    './pages/**/*.{js,ts,jsx,tsx}', // Add this line
    './components/**/*.{js,ts,jsx,tsx}', // Add this line
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}