// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    azure: {
      apiKey: process.env.AZURE_OPENAI_AI_API_KEY,
      endpoint: process.env.AZURE_OPENAI_ENDPOINT,
      apiVersion: process.env.AZURE_OPENAI_API_VERSION || '2024-10-21',
      deployment: process.env.AZURE_OPENAI_DEPLOYMENT,
    },
    foundry:{
      azureAiProjectEndpoint: process.env.AZURE_FOUNDRY_AI_PROJECT_ENDPOINT,
      azureAiAgentName: process.env.AZURE_FOUNDRY_AI_AGENT_NAME,
      azureAiApiKey: process.env.AZURE_FOUNDRY_AI_API_KEY,
      azureAgentVersion: process.env.AZURE_FOUNDRY_AGENT_VERSION,
    }
  },
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
