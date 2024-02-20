<script setup lang="ts">
const router = useRouter()
const routes = router
  .getRoutes()
  .filter((i) => i.path.startsWith('/blogs/') && i.meta.frontmatter)
  .map((i) => ({
    path: i.meta.frontmatter.redirect || i.path,
    title: i.meta.frontmatter.title,
    date: i.meta.frontmatter.date,
    redirect: i.meta.frontmatter.redirect,
  }))

const blogs = computed(() => routes)
// console.log(routes)
</script>

<template>
  <ul>
    <template v-if="!blogs.length">
      <div py2 op50>{ nothing here yet }</div>
    </template>

    <template v-for="(route, idx) in blogs" :key="route.path">
      <div
        class="slide-enter"
        :style="{
          '--enter-stage': idx,
          '--enter-step': '60ms',
        }"
      >
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
                <!-- {{ formatDate(route.date, true) }} -->
              </span>
            </div>
          </li>
        </component>
      </div>
    </template>
  </ul>
</template>
