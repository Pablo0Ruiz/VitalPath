/** @type {import('tailwindcss').Config} */
const {
  fontSize,
  fontWeight,
  letterSpacing,
  colors,
  spacing,
  borderRadius,
} = require('./src/design-system');

module.exports = {
  content: [
    './App.{js,ts,tsx}',
    './app/**/*.{js,ts,tsx}',
    './components/**/*.{js,ts,tsx}',
    './src/**/*.{js,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors,
      fontSize,
      fontWeight,
      letterSpacing,
      spacing,
      borderRadius,
    },
  },
  plugins: [],
};
