/* eslint-disable no-undef, @typescript-eslint/no-var-requires */
const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      serif: ['Literata', 'serif', 'system-ui'],
    },
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
    plugin(function ({ addComponents }) {
      addComponents({
        '.underlined-line-through': {
          'text-decoration': 'underline line-through',
        },
      });
    }),
    plugin(function ({ addBase }) {
      addBase({
        '@font-face': {
          fontFamily: 'Literata',
          fontWeight: '100 900',
          fontStyle: 'normal',
          src: `url(/fonts/Literata-VariableFont.ttf)`,
        },
      });
    }),
  ],
};
