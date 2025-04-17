/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',         // pour tout ce qu’il y a dans /src
    './src/pages/**/*.{js,ts,jsx,tsx}',   // pages
    './src/components/**/*.{js,ts,jsx,tsx}', // composants
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
