<script setup lang="ts">
import { Blog } from '~/types'
import dayjs from 'dayjs'

const router = useRouter()
const routes: Blog[] = router
  .getRoutes()
  .filter((i) => i.path.startsWith('/blogs/') && i.meta.frontmatter)
  .map((i) => ({
    path: i.meta.frontmatter.redirect || i.path,
    title: i.meta.frontmatter.title,
    date: i.meta.frontmatter.date,
    redirect: i.meta.frontmatter.redirect,
  }))

const getYear = (a: Date | string | number) => dayjs(a).year()
const isFuture = (a?: Date | string | number) => a && new Date(a) > new Date()
const isSameYear = (a?: Date | string | number, b?: Date | string | number) => a && b && getYear(a) === getYear(b)
function isSameGroup(a: Blog, b?: Blog) {
  return isFuture(a.date) === isFuture(b?.date) && isSameYear(a.date, b?.date)
}

function getGroupName(p: Blog) {
  if (isFuture(p.date)) return 'Upcoming'
  return getYear(p.date)
}

const blogs = computed(() => routes.sort((a, b) => +new Date(b.date) - +new Date(a.date)))
</script>

<template>
  <ul>
    <template v-if="!blogs.length">
      <div py2 op50>{ nothing here yet }</div>
    </template>

    <template v-for="(route, idx) in blogs" :key="route.path">
      <div v-if="!isSameGroup(route, blogs[idx - 1])" select-none relative h20 pointer-events-none>
        <span text-8em color-transparent absolute left--3rem top--2rem font-bold text-stroke-2 text-stroke-hex-aaa op10>{{ getGroupName(route) }}</span>
      </div>
      <component
        :is="route.path.includes('://') ? 'a' : 'RouterLink'"
        v-bind="
          route.path.includes('://')
            ? {
                href: route.path,
                target: '_blank',
                rel: 'noopener noreferrer',
              }
            : {
                to: route.path,
              }
        "
        class="item block font-normal mb-6 mt-2 no-underline"
      >
        <li class="no-underline" flex="~ col md:row gap-2 md:items-center">
          <div class="title text-lg leading-1.2em" flex="~ gap-2 wrap">
            <span align-middle>{{ route.title }}</span>
          </div>

          <div flex="~ gap-2 items-center">
            <span v-if="route.redirect" align-middle op50 flex-none text-xs ml--1 mt--1 i-carbon-arrow-up-right title="External" />

            <span text-sm op50 ws-nowrap>
              {{ formatDate(route.date) }}
            </span>
          </div>
        </li>
      </component>
    </template>
  </ul>
</template>
