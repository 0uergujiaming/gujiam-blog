---
title: 博客搭建
date: 2021-10-3 16:00:00
description: 博客的搭建记录
---


<route lang="yaml">
meta:
  layout: home
</route>

[[toc]]


记录下博客项目的搭建记录

## 介绍

最近想搭建个博客记录开发过程中遇到的问题和难点以及解决过程，计划使用vue3+vite+ts，不需要服务端，博客直接写在项目内，使用md编写
需要支持把md文件直接转换成页面渲染以及在md文件中写html、js、以及vue

## 项目搭建

### 使用vite创建vue3+ts项目

```js
pnpm create vite
```

命令行配置中选择vue3和typescript

### vite-ssg

使用[vite-ssg](https://github.com/antfu/vite-ssg)生成静态站点

```js
pnpm add vite-ssg -D
```

```ts
// src/main.ts
import { ViteSSG } from 'vite-ssg'
import App from './App.vue'

export const createApp = ViteSSG(App)
```

```json
// package.json
{
  "scripts": {
    "dev": "vite",
-   "build": "vite build"
+   "build": "vite-ssg build"
  }
}
```

### 路由

使用[vite-plugin-pages](https://github.com/hannoeru/vite-plugin-pages)实现根据目录结构自动生成路由；使用[vite-plugin-vue-layouts](https://github.com/JohnCampionJr/vite-plugin-vue-layouts)实现路由layout，目前没有需要使用到多个layout的场景，方便后续加入；

```js
pnpm add vue-router vite-plugin-pages vite-plugin-vue-layouts -D
```

//vite.config.ts

```js
import Pages from 'vite-plugin-pages'
...

Pages({
  // 配置需要生成路由的文件后缀
  extensions: ['vue'],
  // 配置需要生成路由的目录
  dirs: 'src/pages',
}),

```

```ts
// src/main.ts

import autoRoutes from 'pages-generated'

export const createApp = ViteSSG(App, {
  routes: autoRoutes,
})
```

现在在`src/pages`目录下的vue文件就会自动按照目录结构生成路由了

```js
src/pages/
  ├── users/
  │  ├── [id].vue
  │  └── index.vue
  └── users.vue

[
  {
    "path": "/users",
    "component": "/src/pages/users.vue",
    "children": [
      {
        "path": "",
        "component": "/src/pages/users/index.vue",
        "name": "users"
      },
      {
        "path": ":id",
        "component": "/src/pages/users/[id].vue",
        "name": "users-id"
      }
    ]
  }
]
```

配置`layout`

```ts
// vite.config.ts
import Layouts from 'vite-plugin-vue-layouts'

...

Layouts({
  // 配置默认使用的layout，默认使用src/layouts目录，‘home’指向home.vue
  defaultLayout: 'home',
}),
```

```vue
// src/layout/home.vue

<template>
  <Navbar />
  <main>
    <RouterView />
  </main>
</template>
```

```ts
// main.ts

import { setupLayouts } from 'virtual:generated-layouts'

...
export const createApp = ViteSSG(
  App,
  {
    routes: setupLayouts(autoRoutes),
  }
)
```

现在所有路由都可以自动使用这个带`navbar`的`home layout`了，需要使用其他`layout`的页面可以在页面内加入配置

```vue
<template>我是使用其他layout的页面</template>

<route lang="yaml">
meta:
  layout: other
</route>
```

然后在`layouts`目录下编写`other layout`即可

在`tsconfig.json`中加入`vite-plugin-pages`和`vite-plugin-vue-layouts`types支持，不然`pages-generated`和`virtual:generated-layouts`会报错

```json
// tsconfig.json

{
  "compilerOptions": {
    ...
    "types": [...,"vite-plugin-pages/client","vite-plugin-vue-layouts/client"],

  },
  ...
}

```

### vue-use

使用[vue-use](https://vueuse.org/)提升开发效率

```js
pnpm add @vueuse/core
```

### auto-import自动导入

使用[unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components)实现组件的自动导入，使用[unplugin-auto-import](https://github.com/unplugin/unplugin-auto-import)实现`hooks`自动导入

```js
pnpm add -D unplugin-vue-components unplugin-auto-import
```

```ts
// vite.config.ts

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

...

AutoImport({
  // 配置支持哪些包自动导入
  imports: ['vue', 'vue-router', '@vueuse/core'],
  // 配置项目内哪些文件支持自动导入
  dirs: ['src/composables'],
  // 是否支持在vue template中使用自动导入
  vueTemplate: true,
  // 配置d.ts类型文件生成位置，默认在根目录下
  dts: 'src/components.d.ts',
}),

Components({
  // 配置哪些文件支持自动导入为组件，不指定目录是默认为src/components目录下
  extensions: ['vue'],
  // filters for transforming targets
  include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
  // 配置d.ts类型文件生成位置，默认在根目录下
  dts: 'src/components.d.ts',
}),
```

现在项目内就可以写组件名或者hooks不需要手动导入了，而且还有`ts`类型支持

### unocss

使用[unocss](https://unocss.dev/)提升开发效率和体验

```js
pnpm add unocss -D
```

```ts
// vite.config.ts

import UnoCSS from 'unocss/vite'

plugins: [UnoCss()]
```

```ts
// main.ts

// 引入样式reset文件
import '@unocss/reset/tailwind.css'

import 'uno.css'
```

根目录下创建`uno.config.ts`文件

```ts
import { defineConfig, presetAttributify, presetIcons, presetUno, presetWebFonts, transformerDirectives } from 'unocss'

export default defineConfig({
  presets: [
    presetIcons({
      extraProperties: {
        display: 'inline-block',
        height: '1.2em',
        width: '1.2em',
        'vertical-align': 'text-bottom',
      },
    }),
    presetAttributify(),
    presetUno(),
    presetWebFonts({
      fonts: {
        sans: 'Inter:400,600,800',
        mono: 'DM Mono:400,600',
      },
    }),
  ],
  transformers: [transformerDirectives()],
})
```

使用：

```vue
// layouts/home.vue

<template>
  <Navbar />
  <main px-7 py-10>
    <RouterView />
  </main>
</template>
```

更多使用技巧参考[unocss interactive-docs](https://unocss.dev/interactive/)

使用图标

```js
pnpm add -D @iconify/json
```

<div i-carbon-home />

```vue
<div i-carbon-home />
```

[图标库](https://icones.js.org/)

### markdown

使用[unplugin-vue-markdown](https://github.com/unplugin/unplugin-vue-markdown)将`markdown`编译成`vue`组件，并且会将`md`的`frontmatter`解析到当前组件实例的`frontmatter`变量中
使用[markdown-it-shikiji](https://shikiji.netlify.app/packages/markdown-it)实现代码块`highlight`
使用[markdown-it-anchor](https://github.com/valeriangalliat/markdown-it-anchor)优化`anchor`
使用[markdown-it-link-attributes](https://github.com/crookedneighbor/markdown-it-link-attributes)优化`a`标签

```md
---
name: My Cool App
---

# Hello World

This is {{frontmatter.name}}
```

```js
pnpm add unplugin-vue-markdown markdown-it-shikiji markdown-it-anchor markdown-it-link-attributes @unhead/vue -D
```

```ts
// vite.config.ts
import Markdown from 'unplugin-vue-markdown/vite'
import Shiki from 'markdown-it-shikiji'
import anchor from 'markdown-it-anchor'
import LinkAttributes from 'markdown-it-link-attributes'

Markdown({
  // 配置wrapperComponent，会将md渲染到组件的slot中，且会将frontmatter传入到该组件的props，默认为components目录下
  wrapperComponent: () => 'WrapperPost',
  // 配置md内容容器class
  wrapperClasses: () => 'prose m-auto text-left',
  // 是否自动将frontmatter中相关信息设置为document中相关信息，比如会自动把document.title设置为frontmatter.title,一起一些其他的meta信息
  headEnabled: true,
  // 在初始化时配置一些插件
  async markdownItSetup(md) {
    md.use(
      // 配置highlight主题,以及css变量前缀(方便自己调整样式)
      await Shiki({
        themes: {
          dark: 'vitesse-dark',
          light: 'vitesse-light',
        },
        defaultColor: false,
        cssVariablePrefix: '--s-',
      })
    )

    // 配置anchor配置
    md.use(anchor, {
      // slugify,
      permalink: anchor.permalink.linkInsideHeader({
        symbol: '#',
        renderAttrs: () => ({ 'aria-hidden': 'true' }),
      }),
    })

    // 配置link配置，所有link都默认新标签页打开
    md.use(LinkAttributes, {
      matcher: (link: string) => /^https?:\/\//.test(link),
      attrs: {
        target: '_blank',
        rel: 'noopener',
      },
    })
  },
}),
```

```vue
// components/WrapperPost.vue
<script setup lang="ts">
const { frontmatter } = defineProps({
  frontmatter: {
    type: Object,
    required: true,
  },
})
const route = useRoute()
</script>

<template>
  // 可以从frontmatter中拿到一些博客的信息做统一展示，比如博客标题、介绍和创建时间，如：
  <div>{{frontmatter.title}}</div>
  <div>{{frontmatter.date}}</div>
  // 博客内容会渲染到slot中
  <article ref="content" :class="[frontmatter.class]">
    <slot />
  </article>
</template>

```
现在所有的`md`文件都可以在运行时编译成`vue`组件了,在`vite.config.ts`中调整配置
```ts
// vite.config.ts
Vue({
  include: [/\.vue$/, /\.md$/],
  ...
}),

Pages({
  extensions: ['vue', 'md'],
  ...
}),

Components({
  extensions: ['vue', 'md'],
  ...
}),
```
把原先只支持`vue`文件的地方都追加上`md`，项目中就可以完全把`md`文件当成`vue`文件使用了

### 实现博客列表
定义博客列表路由，在`src/pages`下创建`blogs`目录,在目录下创建`index.md`，这个时候`/blogs`路由就指向这个`md`了

计划获取到`blogs`目录下除`index.md`以外的`markdown`文件的`frontmatter`来生成博客列表的数据，开干吧
首先要实现`routes`配置中能获取到`frontmatter`，通过`vite-plugin-pages`的`extendRoute`配置可以实现在自动生成的路由配置中自定义修改
```ts
// vite.config.ts
import { resolve } from 'node:path'
import matter from 'gray-matter'

Pages({
  ...
  extendRoute(route) {
    // 获取到路由对应的文件路径，只对md文件做处理
    const path = resolve(__dirname, route.component.slice(1))
    if (path.endsWith('.md')) {
      const md = fs.readFileSync(path, 'utf-8')
      // 使用gray-matter获取到md内的frontmatter设置到route.meta中
      const { data } = matter(md)
      route.meta = Object.assign(route.meta || {}, { frontmatter: data })
    }

    return route
  },
}),
```
封装`BlogList`组件
```vue
// components/BlogList.vue

<script setup lang="ts">
const router = useRouter()
// 拿到所有路由，过滤出blogs目录下除index外的所有路由，从route.meta.frontmatter中拿到需要的数据生成列表
const blogs = router
  .getRoutes()
  .filter((i) => i.path.startsWith('/blogs/') && i.meta.frontmatter)
  .map((i) => ({
    path: i.meta.frontmatter.redirect || i.path,
    title: i.meta.frontmatter.title,
    date: i.meta.frontmatter.date,
    redirect: i.meta.frontmatter.redirect,
  }))
</script>

<template>
  <ul>
    <template v-if="!blogs.length">
      <div py2 op50>{ nothing }</div>
    </template>

    <template v-for="(route, idx) in blogs" :key="route.path">
      ...
    </template>
  </ul>
</template>
```

在`pages/blogs/index.md`中使用`BlogList`组件
```
// pages/blogs/index.md

---
title: Blogs
description: 我的博客列表页面
---

<BlogList />

```

这样就实现了自动根据`blogs`目录下的文件生成博客列表,之后写博客直接在该目录下写`md`就行了

### devtools
```js
pnpm add vite-plugin-vue-devtools -D
```
```ts
// vite.config.ts
import VueDevTools from 'vite-plugin-vue-devtools'

plugins: [
  ...
  VueDevTools(),
]
```
