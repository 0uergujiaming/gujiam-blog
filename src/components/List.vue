<script setup lang="ts">
import { useRouter } from 'vue-router'
import { formatDate } from '~/composables'
import type { Blog } from '~/types'

const props = defineProps<{
  type?: string
  posts?: Blog[]
}>()

const router = useRouter()
console.log(router.getRoutes())
const routes: Blog[] = router.getRoutes()
  .filter(i => i.path.startsWith('/blogs') && i.meta.frontmatter.date)
  .sort((a, b) => +new Date(b.meta.frontmatter.date) - +new Date(a.meta.frontmatter.date))
  .filter(i => !i.path.endsWith('.html') && i.meta.frontmatter.type === props.type)
  .map(i => ({
    path: i.path,
    title: i.meta.frontmatter.title,
    date: i.meta.frontmatter.date,
    duration: i.meta.frontmatter.duration,
  }))

const posts = computed(() => (props.posts || routes))
</script>

<template>
  <ul>
    <template v-if="!posts.length">
      <div py2 op50>
        nothing here yet
      </div>
    </template>
    <app-link
      v-for="route in posts" :key="route.path" class="item block font-normal mb-6 mt-2 no-underline"
      :to="route.path"
    >
      <li class="no-underline">
        <div class="title text-lg">
          {{ route.title }}
        </div>
        <div class="time opacity-50 text-sm -mt-1">
          {{ formatDate(route.date) }}
          <span v-if="route.duration" class="opacity-50">· {{ route.duration }}</span>
        </div>
      </li>
    </app-link>
  </ul>
</template>
