// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/icon'],
  nitro: {
    preset: 'netlify'
  },
  
  // If you want SPA mode (client-side only)
  ssr: false,
  
  // Generate a fallback page for 404s
  generate: {
    fallback: true
  },

  // Other config options...
  devtools: { enabled: true }
});
