import { resolve } from 'node:path'
import fs from 'fs-extra'
import matter from 'gray-matter'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Markdown from 'unplugin-vue-markdown/vite'
import VueDevTools from 'vite-plugin-vue-devtools'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import VueRouter from 'unplugin-vue-router/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'

import MarkdownItShiki from '@shikijs/markdown-it'
import { rendererRich, transformerTwoslash } from '@shikijs/twoslash'
// import Shiki from 'markdown-it-shikiji'
import anchor from 'markdown-it-anchor'
import LinkAttributes from 'markdown-it-link-attributes'

// @ts-expect-error missing types
import TOC from 'markdown-it-table-of-contents'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '~/': `${resolve(__dirname, 'src')}/`,
    },
  },
  plugins: [
    UnoCSS(),

    VueRouter({
      extensions: ['.vue', '.md'],
      routesFolder: 'src/pages',
      logs: true,
      extendRoute(route) {
        const path = route.components.get('default')
        if (!path)
          return

        if (path.endsWith('.md')) {
          const { data } = matter(fs.readFileSync(path, 'utf-8'))
          route.addToMeta({
            frontmatter: data,
          })
        }
      },
    }),

    Vue({
      include: [/\.vue$/, /\.md$/],
    }),

    Markdown({
      wrapperComponent: () => 'WrapperPost',
      wrapperClasses: () => 'prose m-auto text-left',
      headEnabled: true,
      async markdownItSetup(md) {
        md.use(
          await MarkdownItShiki({
            themes: {
              dark: 'vitesse-dark',
              light: 'vitesse-light',
            },
            defaultColor: false,
            cssVariablePrefix: '--s-',
            transformers: [
              transformerTwoslash({
                explicitTrigger: true,
                renderer: rendererRich(),
              }),
            ],
          }),
        )

        md.use(anchor, {
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

        md.use(TOC, {
          includeLevel: [1, 2, 3, 4],
          // slugify,
          containerHeaderHtml: '<div class="table-of-contents-anchor"></div>',
        })
      },
    }),

    AutoImport({
      imports: ['vue', VueRouterAutoImports, '@vueuse/core'],
      dirs: ['src/logics'],
      vueTemplate: true,
      dts: 'src/auto-imports.d.ts',
    }),

    Components({
      // allow auto load markdown components under `./src/components/`
      extensions: ['vue', 'md'],
      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      dts: 'src/components.d.ts',
      resolvers: [
        IconsResolver({
          componentPrefix: '',
        }),
      ],
    }),

    Icons({
      defaultClass: 'inline',
      defaultStyle: 'vertical-align: sub;',
    }),

    VueDevTools(),
  ],
})
