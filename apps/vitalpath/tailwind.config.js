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
        'inter-light': ['Inter_18pt-Light', 'sans-serif'],
        'inter-light-italic': ['Inter_18pt-LightItalic', 'sans-serif'],
        'inter-regular': ['Inter_18pt-Regular', 'sans-serif'],
        'inter-thin': ['Inter_18pt-Thin', 'sans-serif'],
        'inter-thin-italic': ['Inter_18pt-ThinItalic', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
