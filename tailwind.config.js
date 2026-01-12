/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B00', // Enerjik Turuncu
        secondary: '#1A1A1A', // Koyu Gri
        surface: '#F3F4F6' // Açık Gri Zemin
      }
    },
  },
  plugins: [],
};