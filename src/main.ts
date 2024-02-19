
import '@unocss/reset/tailwind.css'
import './styles/main.css'

import 'uno.css'

import App from './App.vue'
import { ViteSSG } from 'vite-ssg'
import { setupLayouts } from 'virtual:generated-layouts'
import { routes } from 'vue-router/auto/routes'

export const createApp = ViteSSG(
  App,
  {
    routes: setupLayouts(routes),
    base: import.meta.env.BASE_URL,
  },
  ({ router, app, isClient }) => {}
)
