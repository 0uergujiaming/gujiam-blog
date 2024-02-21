import { resolve } from 'node:path'
import fs from 'fs-extra'
import matter from 'gray-matter'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import Layouts from 'vite-plugin-vue-layouts'
import Pages from 'vite-plugin-pages'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Markdown from 'unplugin-vue-markdown/vite'
import Shiki from 'markdown-it-shikiji'
import VueDevTools from 'vite-plugin-vue-devtools'
import anchor from 'markdown-it-anchor'
import LinkAttributes from 'markdown-it-link-attributes'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '~/': `${resolve(__dirname, 'src')}/`,
    },
  },
  plugins: [
    UnoCSS(),

    Vue({
      include: [/\.vue$/, /\.md$/],
      reactivityTransform: true,
      script: {
        defineModel: true,
      },
    }),

    Pages({
      extensions: ['vue', 'md'],
      dirs: 'src/pages',
      extendRoute(route) {
        const path = resolve(__dirname, route.component.slice(1))
        if (path.endsWith('.md')) {
          const md = fs.readFileSync(path, 'utf-8')
          const { data } = matter(md)
          route.meta = Object.assign(route.meta || {}, { frontmatter: data })
        }

        return route
      },
    }),

    Layouts({
      defaultLayout: 'home',
    }),

    AutoImport({
      imports: ['vue', 'vue-router', '@vueuse/core'],
      dirs: ['src/composables'],
      vueTemplate: true,
      dts: 'src/auto-imports.d.ts',
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
      wrapperClasses: () => 'prose m-auto text-left',
      headEnabled: true,
      async markdownItSetup(md) {
        md.use(
          await Shiki({
            themes: {
              dark: 'vitesse-dark',
              light: 'vitesse-light',
            },
            defaultColor: false,
            cssVariablePrefix: '--s-',
          })
        )

        md.use(anchor, {
          // slugify,
          permalink: anchor.permalink.linkInsideHeader({
            symbol: '#',
            renderAttrs: () => ({ 'aria-hidden': 'true' }),
          }),
        })

        md.use(LinkAttributes, {
          matcher: (link: string) => /^https?:\/\//.test(link),
          attrs: {
            target: '_blank',
            rel: 'noopener',
          },
        })
      },
    }),

    VueDevTools(),
  ],
})
