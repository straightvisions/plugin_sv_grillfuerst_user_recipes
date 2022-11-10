/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './src/**/*.{html,js}',
  ],
  theme: {
    fontFamily: {
      sans: [
        "Gentona Book, sans-serif",
      ],
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
