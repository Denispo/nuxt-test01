import { AzureOpenAI } from 'openai'

export const useAzureOpenAI = () => {
   const config = useRuntimeConfig()

   return new AzureOpenAI({
      endpoint: config.azure.endpoint,
      apiKey: config.azure.apiKey,
      apiVersion: config.azure.apiVersion,
      // deployment: config.azure.deployment, // můžeš dát sem, pokud chceš
   })
}