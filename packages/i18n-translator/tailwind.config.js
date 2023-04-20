/** @type {import('tailwindcss').Config} */
const { blackA, violet } = require('@radix-ui/colors');
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      ...blackA,
      ...violet,
    }
  },
  plugins: []
};
