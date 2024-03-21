<script setup lang="ts">
function toTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

const { y: scroll } = useWindowScroll()
</script>

<template>
  <header class="nav flex pa-6 flex-justify-end">
    <nav>
      <RouterLink to="/" title="Home">
        <span class="lt-md:hidden">Home</span>
        <div i-carbon-home md:hidden />
      </RouterLink>
      <RouterLink to="/blogs" title="Blog">
        <span class="lt-md:hidden">Blogs</span>
        <div i-ri-article-line md:hidden />
      </RouterLink>
    </nav>
    <div class="right ml-4">
      <a href="https://github.com/0uergujiaming" target="_blank" title="GitHub">
        <div i-uil-github-alt />
      </a>
      <ToggleTheme />
    </div>
    <button
      title="Scroll to top"
      fixed right-3 bottom-3 w-10 h-10 hover:op100 rounded-full
      hover-bg-hex-8883 transition duration-300 z-100 print:hidden
      :class="scroll > 300 ? 'op30' : 'op0! pointer-events-none'"
      @click="toTop()"
    >
      <div i-ri-arrow-up-line />
    </button>
  </header>
</template>

<style scoped>
.nav a {
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  transition: opacity 0.2s ease;
  opacity: 0.6;
  outline: none;
}

.nav a:hover {
  opacity: 1;
  text-decoration-color: inherit;
}
.nav nav,
.right {
  display: flex;
  gap: 1.2rem;
}
</style>
