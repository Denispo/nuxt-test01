import { AIProjectClient } from '@azure/ai-projects'

export default defineEventHandler(async (event) => {
   const config = useRuntimeConfig()
   const { message, conversationId } = await readBody(event)

   if (!message?.trim()) {
      throw createError({ statusCode: 400, message: 'Message is required' })
   }

   const endpoint = config.foundry.azureAiProjectEndpoint;
   const apiKey = config.foundry.azureAiApiKey;
   const agentName = config.foundry.azureAiAgentName;
   const agentVersion = config.foundry.azureAgentVersion;

   if (!apiKey) {
      throw createError({ statusCode: 500, message: 'API Key is not configured' })
   }

   const tokenCredential = {
      async getToken(scopes) {
         return {
            token: apiKey,
            expiresOnTimestamp: Date.now() + 60 * 60 * 1000
         };
      }
   };

   // Vytvoříme AIProjectClient přesně jako v tvé ukázce
   const projectClient = new AIProjectClient(endpoint, tokenCredential)
   const openAIClient = projectClient.getOpenAIClient()

   try {
      let currentConversationId = conversationId

      // 1. Vytvoření konverzace (pokud ještě neexistuje)
      if (!currentConversationId) {
         const conversation = await openAIClient.conversations.create({
            items: [
               {
                  type: 'message',
                  role: 'user',
                  content: message,
               },
            ],
         })
         currentConversationId = conversation.id
      }

      // 2. Zavolání agenta (přesně podle tvé ukázky)
      const response = await openAIClient.responses.create(
         {
            conversation: currentConversationId,
         },
         {
            body: {
               agent_reference: {
                  name: agentName,
                  version: agentVersion,
                  type: 'agent_reference',
               },
            },
         }
      )

      return {
         conversationId: currentConversationId,
         response: response.output_text ?? '',
         //raw: response,
      }
   } catch (error: any) {
      console.error('Azure AI error:', error)
      throw createError({
         statusCode: 500,
         message: error.message || 'Chyba při komunikaci s agentem',
      })
   }
})