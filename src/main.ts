import '@unocss/reset/tailwind.css'
import './styles/main.css'

import 'uno.css'

import App from './App.vue'
import { ViteSSG } from 'vite-ssg'
import { setupLayouts } from 'virtual:generated-layouts'
import autoRoutes from 'pages-generated'
import { UserModule } from './types'

export const createApp = ViteSSG(
  App,
  {
    routes: setupLayouts(autoRoutes),
  },
  (ctx) => {
    Object.values(import.meta.glob<{ install: UserModule }>('./modules/*.ts', { eager: true })).forEach((module) => module?.install(ctx))
  }
)
