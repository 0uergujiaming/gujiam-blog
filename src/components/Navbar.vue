<script setup lang="ts">

</script>

<template>
  <header class="header" p-6 flex="~ " items-center>
    <router-link to="/" class="logo font-400 text-xl">
      Gujiam
    </router-link>
    <div flex-1 />
    <nav class="nav">
      <router-link to="/blogs" title="Blog">
        <span class="lt-md:hidden">Blog</span>
        <div i-ri-article-line md:hidden />
      </router-link>
      <a href="https://github.com/0uergujiaming" target="_blank" title="GitHub">
        <div i-uil-github-alt />
      </a>
    </nav>
  </header>
</template>

<style scoped>
.header a {
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  transition: opacity 0.2s ease;
  opacity: 0.6;
  outline: none;
}
.header a:hover {
  opacity: 1;
}

.nav {
  display: grid;
  grid-gap: 1.2rem;
  grid-auto-flow: column;
}
</style>
