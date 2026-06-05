// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  nitro: {
    preset: 'bun',
    storage: {
      // "mount point" (klíč) by se měl pro přehlednost jmenova stejně jako root adresář uložiště. zde tedy "'./storage'"
      storage: {
        driver: 'fs',
        base: './storage'          // ← adresář v rootu projektu
      }
    },
  },

})
