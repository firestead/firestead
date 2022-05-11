
const typography = require('windicss/plugin/typography')
const colors = require('windicss/colors')
const forms = require('windicss/plugin/forms')
const lineClamp = require('windicss/plugin/line-clamp')
const aspectRatio = require("windicss/plugin/aspect-ratio")

delete colors['coolGray']

module.exports = {
  extract: {
    include: ['**/*.{vue,html,jsx,tsx}'],
    exclude: ['node_modules', '.git']
  },
  safelist: ['prose', 'prose-sm', 'm-auto'],
  darkMode: 'class',
  plugins: [typography],
  theme: {
    extend: {
      colors: {
        teal: colors.teal,
      },
    }
  },
  plugins: [
    typography,
    forms,
    lineClamp,
    aspectRatio
  ],
}