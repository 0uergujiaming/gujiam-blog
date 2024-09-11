import '@unocss/reset/tailwind.css'
import '@shikijs/twoslash/style-rich.css'
import './styles/main.css'
import 'uno.css'

import { ViteSSG } from 'vite-ssg'
import { routes } from 'vue-router/auto-routes'

import App from './App.vue'
import type { UserModule } from './types'

export const createApp = ViteSSG(
  App,
  {
    routes,
  },
  (ctx) => {
    Object.values(import.meta.glob<{ install: UserModule }>('./modules/*.ts', { eager: true })).forEach(module => module?.install(ctx))
  },
)
