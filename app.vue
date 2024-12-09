<script setup lang="ts">
import { useDark } from '@vueuse/core'
import { ConfigProvider } from 'radix-vue'
import { Analytics } from '@vercel/analytics/nuxt'

const useIdFunction = () => useId()

useHead({
  titleTemplate: '%s - Tool Box',
  script: [
    `(function () {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      const setting = localStorage.getItem('color-schema') || 'auto'
      if (setting === 'dark' || (prefersDark && setting !== 'light'))
        document.documentElement.classList.toggle('dark', true)
    })()`,
  ],
})
useDark()
preloadComponents(['header', 'nav-list-item'])
</script>

<template>
  <ConfigProvider :use-id="useIdFunction">
    <Analytics />
    <Toaster />
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </ConfigProvider>
</template>

<style>
@import url('./assets/css/tailwind.css');

body {
  font-family: 'Roboto', sans-serif;
}

/* CSS Reset */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Roboto', sans-serif;
  line-height: 1.5;
}

/* Additional reset rules */
html {
  font-size: 16px;
}

img,
picture,
video,
canvas,
svg {
  display: block;
  max-width: 100%;
}

input,
button,
textarea,
select {
  font: inherit;
}

p,
h1,
h2,
h3,
h4,
h5,
h6 {
  overflow-wrap: break-word;
}
</style>
