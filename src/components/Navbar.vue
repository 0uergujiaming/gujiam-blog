<template>
  <header class="nav flex pa-6 flex-justify-between">
    <nav>
      <RouterLink to="/" title="Home">
        <span class="lt-md:hidden">Home</span>
        <div i-carbon-home md:hidden />
      </RouterLink>
      <RouterLink to="/blogs" title="Blog">
        <span class="lt-md:hidden">Blog</span>
        <div i-ri-article-line md:hidden />
      </RouterLink>
      <RouterLink to="/blogs" title="Blog">
        <span class="lt-md:hidden">Blog</span>
        <div i-ri-article-line md:hidden />
      </RouterLink>
    </nav>
    <div class="right">
      <a href="https://github.com/0uergujiaming" target="_blank" title="GitHub">
        <div i-uil-github-alt />
      </a>
      <ToggleTheme />
    </div>
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
