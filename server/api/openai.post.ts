// server/api/openai.post.ts
import { useAzureOpenAI } from '~~/server/utils/azure-openai'

export default defineEventHandler(async (event) => {
   const client = useAzureOpenAI()
   const body = await readBody(event)

   // Bezpečnostní kontrola + podpora pro string
   let messages = body.messages

   if (typeof messages === 'string') {
      try {
         messages = JSON.parse(messages)
      } catch (e) {
         throw createError({
            statusCode: 400,
            statusMessage: 'messages musí být pole objektů (ne string)',
         })
      }
   }

   if (!Array.isArray(messages)) {
      throw createError({
         statusCode: 400,
         statusMessage: 'messages musí být pole objektů',
      })
   }

   const response = await client.chat.completions.create({
      model: body.model || useRuntimeConfig().azure.deployment,
      messages: messages,
      temperature: body.temperature ?? 0.7,
   })

   return response
})