/** @type {import('tailwindcss').Config} */
const FormKitVariants = require('@formkit/themes/tailwindcss')

export default {
  content: [
    './tailwind-theme.js',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#008B74',
        secondary: '#E8F4EB',
        tertiary: '#5E8E6F',
      },

    },
  },
  plugins: [FormKitVariants],
}

