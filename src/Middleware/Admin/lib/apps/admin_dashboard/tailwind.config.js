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
    extend: {
      minWidth: {
        'max': 'max-content',
      },
      height: {
        '200': '20rem'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
