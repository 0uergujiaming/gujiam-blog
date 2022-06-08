<script setup lang="ts">
defineProps({
  total: {
    type: Number,
    default: 10,
  },
  current: {
    type: Number,
    default: 1,
  },
})
</script>

<template>
  <div class="star">
    <template v-for="star in total" :key="star">
      <div v-if="star <= current" i-carbon-star-filled />
      <div v-else i-carbon-star />
    </template>
  </div>
</template>

<style scoped>
.star {
  display: inline-grid;
  grid-gap: 0.4rem;
  grid-auto-flow: column;
}
</style>
