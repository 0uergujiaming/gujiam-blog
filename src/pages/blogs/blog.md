---
title: 博客搭建
date: 2021-10-31T16:00:00Z
description: 博客的搭建记录
---

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

export const createApp = ViteSSG(App,{
  routes: autoRoutes
})
```

在`tsconfig.json`中加入`vite-plugin-pages`types支持，不然`pages-generated`会报错
```json
// tsconfig.json

{
  "compilerOptions": {
    ...
    "types": [...,"vite-plugin-pages/client"],

  },
  ...
}

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
现在所有路由都可以自动使用这个带`navbar`的`home layout`了，需要使用其他`layout`的页面可以在页面内加入配置
```vue
<template>
  我是使用其他layout的页面
</template>

<route lang="yaml">
meta:
  layout: other
</route>

```
然后在`layouts`目录下编写`other layout`即可

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

plugins: [
  UnoCss()
]
```
```ts
// main.ts

// 引入样式reset文件
import '@unocss/reset/tailwind.css'

import 'uno.css'
```
根目录下创建`uno.config.ts`文件
```ts
import { 
  defineConfig, 
  presetAttributify, 
  presetIcons, 
  presetUno, 
  presetWebFonts, 
  transformerDirectives 
} from 'unocss'

export default defineConfig({
  presets: [
    presetIcons({
      extraProperties: {
        'display': 'inline-block',
        'height': '1.2em',
        'width': '1.2em',
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
  transformers: [
    transformerDirectives(),
  ],
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
