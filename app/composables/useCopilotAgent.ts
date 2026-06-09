// composables/useCopilotAgent.ts
import { CopilotStudioClient, type ConnectionSettings } from '@microsoft/agents-copilotstudio-client'
import { Activity, ActivityTypes } from '@microsoft/agents-activity'   // ← přidej tento import
import { ref, onUnmounted } from 'vue'

export const useCopilotAgent = () => {
   const client = ref<CopilotStudioClient | null>(null)
   const messages = ref<Activity[]>([])
   const isConnected = ref(false)

   const connectionSettings: ConnectionSettings = {
      environmentId: '7486943f-f122-efd8-9e5a-f9b2c1322454',
      schemaName: 'dtcz_DestinaceOblasti',
   }

   const initialize = async (entraToken: string) => {
      client.value = new CopilotStudioClient(connectionSettings, entraToken)
      isConnected.value = true
   }

   // 2. Spuštění konverzace (uvítací topic)
   const startConversation = async () => {
      if (!client.value) throw new Error('Client není inicializován')

      const generator = client.value.startConversationStreaming(true)

      for await (const reply of generator) {
         if (reply.type === ActivityTypes.Message && reply.text) {
            messages.value.push(reply)
         }
      }
   }

   // 3. Poslat zprávu – SPRÁVNÝ způsob
   const sendMessage = async (text: string) => {
      if (!client.value) return

      // 1. Vytvoříme správný Activity objekt
      const userActivity = Activity.fromObject({
         type: ActivityTypes.Message,
         text,
         from: { id: 'user', role: 'user' },   // id je důležité
      }) as Activity

      // přidáme uživatelskou zprávu do UI
      messages.value.push(userActivity)

      // 2. Pošleme agentovi
      for await (const reply of client.value.sendActivityStreaming(userActivity)) {
         if (reply.type === ActivityTypes.Message && reply.text) {
            messages.value.push(reply)
         }
      }
   }

   onUnmounted(() => client.value?.dispose?.())

   return {
      messages,
      isConnected,
      initialize,
      startConversation,
      sendMessage,
   }
}