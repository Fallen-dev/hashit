const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ["./**/*.{html,js}"],
  darkMode: 'class',
  theme: {
    fontFamily: {
      code: ['text-code', ...defaultTheme.fontFamily.mono],
      sans: ['Manrope', ...defaultTheme.fontFamily.sans]
    },
    extend: {}
  },
  plugins: [],
}