/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './src/**/*.{html,js}',
  ],
  theme: {
    fontFamily: {
      Body: ['Gentona', 'Arial', 'sans-serif'],
      heading: ['Gentona', 'sans-serif'],
      sans: ['Gentona', 'sans-serif'],
    },
    fontSize: {
      'base': '16px',
      'xs': '12px',
      'sm': '14px',
      'md': '18px',
      'lg': '22px',
      'xl': '24px',
      '2xl': '28px',
      '3xl': '30px'
    },
    /*
    red #D51417
    orange #F59B00
    grey1 #F4F4F4
    grey2 #C6C6C6
    grey3 #6F6E6E.
    
    
    font-family: "Gentona", sans-serif;
    font-weight: 400;
    font-size: 16px;
    line-height: 1.5;
    color:  #1e1e1e;
    
    
     */
    extend: {
      fontFamily: {
        gentona: ['Gentona', 'Arial', 'sans-serif'],
      },
      colors: {
        red: {
          50: '#FFE3E3',
          100: '#FFBDBD',
          200: '#FF8F8F',
          300: '#FF5F5F',
          400: '#FF2F2F',
          500: '#D51417',
          600: '#B20F12',
          700: '#8F0B0D',
          800: '#6C0708',
          900: '#4A0304',
        },
        orange: {
          50: '#FFF3E3',
          100: '#FFE2BF',
          200: '#FFC491',
          300: '#FFA263',
          400: '#FF8B35',
          500: '#F59B00',
          600: '#D97D00',
          700: '#B26000',
          800: '#8E4300',
          900: '#6C2600',
        },
        grey: {
          50: '#F9F9F9',
          100: '#F2F2F2',
          200: '#D9D9D9',
          300: '#BFBFBF',
          400: '#A6A6A6',
          500: '#8C8C8C',
          600: '#737373',
          700: '#595959',
          800: '#404040',
          900: '#262626',
        },
        'greyLight':'#FDFDFD',
        'greyDark':'#473930',
        'grey1': '#F4F4F4',
        'grey2': '#C6C6C6',
        'grey3': '#6F6E6E',
        'black': '#1e1e1e',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.15)',
        'md': '0 4px 6px rgba(0, 0, 0, 0.15)',
        'lg': '0 6px 10px rgba(0, 0, 0, 0.15)',
        'xl': '0 8px 15px rgba(0, 0, 0, 0.15)',
        '2xl': '0 10px 25px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('tailwindcss-box-shadow'),
  ]
}
