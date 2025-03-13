/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'dark-black': '#1A1A1A',
        'gold-accent': '#D4A017',
      },
    },
  },
  plugins: [],
};
