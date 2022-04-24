const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ["./**/*.{html,js}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        code: ['text-code', ...defaultTheme.fontFamily.mono]
      }
    },
  },
  plugins: [],
}