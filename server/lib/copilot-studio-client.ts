// server/lib/copilot-studio-client.ts
import {
   CopilotStudioClient,
   loadCopilotStudioConnectionSettingsFromEnv,
   getTokenAudience,
} from '@microsoft/agents-copilotstudio-client'
import { Activity } from '@microsoft/agents-activity'
import { ConfidentialClientApplication, Configuration } from '@azure/msal-node'

let clientInstance: CopilotStudioClient | null = null

async function acquireToken() {
   const settings = loadCopilotStudioConnectionSettingsFromEnv()

   const config: Configuration = {
      auth: {
         clientId: process.env.clientId!,
         authority: `https://login.microsoftonline.com/${process.env.tenantId}`,
         clientSecret: process.env.clientSecret!,
      },
   }

   const cca = new ConfidentialClientApplication(config)

   // Správný audience pro Copilot Studio (SDK ho umí vygenerovat)
   const audience = getTokenAudience(settings)

   const result = await cca.acquireTokenByClientCredential({
      scopes: [`${audience}/.default`],
   })

   if (!result?.accessToken) {
      throw new Error('Nepodařilo se získat access token pro Copilot Studio')
   }

   return result.accessToken
}

export async function getCopilotStudioClient() {
   if (!clientInstance) {
      const settings = loadCopilotStudioConnectionSettingsFromEnv()
      const token = await acquireToken()
      clientInstance = new CopilotStudioClient(settings, token)
      console.log('✅ Copilot Studio Client úspěšně inicializován')
   }
   return clientInstance
}

// Hlavní funkce – pošle zprávu agentovi a vrátí odpověď
export async function sendToCopilot(
   message: string,
   conversationId: string = `chat-${Date.now()}`
): Promise<string> {
   const client = await getCopilotStudioClient()

   const activity = Activity.fromObject({
      type: 'message',
      text: message,
      conversation: { id: conversationId },
      channelId: 'direct',
   })


   const replies: string[] = []

   // Streamování odpovědí (agent může poslat více zpráv)
   for await (const reply of client.sendActivityStreaming(activity)) {
      if (reply.type === 'message' && reply.text) {
         replies.push(reply.text)
      }
   }

   return replies.join('\n\n') || 'Žádná odpověď od agenta.'
}