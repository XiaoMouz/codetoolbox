// https://nuxt.com/docs/api/configuration/nuxt-config
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  ssr: true,
  devtools: { enabled: true },
  modules: [
    '@nuxt/icon',
    '@vueuse/nuxt',
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate',
  ],
  runtimeConfig: {
    api: 'https://api.mou.best',
  },
  vite: {
    optimizeDeps: {
      include: ['node-fetch-native'],
    },
    plugins: [
      nodePolyfills({
        exclude: ['http', 'https', 'http2'],
        globals: {
          Buffer: true,
          global: true,
          process: true,
        },
        overrides: {
          // fs override
          fs: 'memfs',
        },
        protocolImports: true,
      }),
    ],
  },
})
