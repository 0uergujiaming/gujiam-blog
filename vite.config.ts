import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import Layouts from 'vite-plugin-vue-layouts'
import VueRouter from 'unplugin-vue-router/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Markdown from 'unplugin-vue-markdown/vite'
import Shiki from 'markdown-it-shikiji'
import VueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    UnoCSS(),

    vue({
      include: [/\.vue$/, /\.md$/],
      reactivityTransform: true,
      script: {
        defineModel: true,
      },
    }),

    VueRouter({
      extensions: ['.vue', '.md'],
      dts: 'src/typed-router.d.ts',
    }),

    Layouts(),

    AutoImport({
      imports: [
        'vue',
        'vue-router',
        '@vueuse/core',
        VueRouterAutoImports,
        {
          'vue-router/auto': ['useLink'],
        },
      ],
    }),

    Components({
      // allow auto load markdown components under `./src/components/`
      extensions: ['vue', 'md'],
      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      dts: 'src/components.d.ts',
    }),

    Markdown({
      wrapperComponent: () => 'WrapperPost',
      wrapperClasses:() =>  'prose m-auto text-left',
      headEnabled: true,
      async markdownItSetup(md) {
        md.use(
          await Shiki({
            themes: {
              dark: 'vitesse-dark',
              light: 'vitesse-light',
            },
            defaultColor: false,
          })
        )
      },
    }),

    VueDevTools(),
  ],
})
