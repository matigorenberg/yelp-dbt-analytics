/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'yelp-red': '#d32323',
        'yelp-dark': '#af1f1f',
      },
    },
  },
  plugins: [],
}
