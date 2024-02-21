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
  <div v-if="route.path !== '/'" class="prose m-auto mb-6">
    <RouterLink
      :to="route.path.split('/').slice(0, -1).join('/') || '/'"
      class="font-mono op50 hover:op75"
    >
    <div i-carbon-arrow-left /> back
  </RouterLink>
  </div>
  <div v-if="frontmatter.display ?? frontmatter.title" class="prose m-auto mb-8" :class="[frontmatter.wrapperClass]">
    <h1 class="mb-0 slide-enter-50">
      {{ frontmatter.display ?? frontmatter.title }}
    </h1>
    <p v-if="frontmatter.subtitle" class="opacity-50 !-mt-6 italic slide-enter">
      {{ frontmatter.subtitle }}
    </p>
    <p v-if="frontmatter.draft" class="slide-enter" bg-orange-4:10 text-orange-4 border="l-3 orange-4" px4 py2>This is a draft post, the content may be incomplete. Please check back later.</p>
  </div>
  <article ref="content" :class="[frontmatter.tocAlwaysOn ? 'toc-always-on' : '', frontmatter.class]">
    <slot />
  </article>
</template>
