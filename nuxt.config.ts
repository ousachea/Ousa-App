// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/icon'],
  nitro: {
    preset: 'netlify'
  },
  ssr: false, // This makes it a SPA
  generate: {
    routes: ['/'] // Add your routes here
  }
});
