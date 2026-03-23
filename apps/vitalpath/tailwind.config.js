const { colors } = require('./src/constants/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,ts,tsx}',
    './app/**/*.{js,ts,tsx}',
    './components/**/*.{js,ts,tsx}',
    './src/**/*.{js,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        interlight: ['Inter_18pt-Light', 'sans-serif'],
        interlightitalic: ['Inter_18pt-LightItalic', 'sans-serif'],
        interregular: ['Inter_18pt-Regular', 'sans-serif'],
        interthin: ['Inter_18pt-Thin', 'sans-serif'],
        interthinitalic: ['Inter_18pt-ThinItalic', 'sans-serif'],
      },

      colors,
    },
  },
  plugins: [],
};
