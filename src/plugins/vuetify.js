// src/plugins/vuetify.js
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const customTheme = {
  dark: false,
  options: { customProperties: true },
  colors: {
    background: '#F2F2F2',
    surface: '#FFFFFF',
    'on-primary': '#333333',
    'on-warning': '#FFFFFF',
    primary: '#6FCF97',
    secondary: '#219653',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#F2994A',
  }
}

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'customTheme',
    themes: {
      customTheme,
    },
  }
})
