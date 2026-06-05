// server/api/sendmessage.post.ts
import { defineEventHandler, readBody, createError } from 'h3'
import {sendToCopilot} from "#server/lib/copilot-studio-client";

export default defineEventHandler(async (event) => {
   const { message, conversationId = `chat-${Date.now()}`, userId = 'anonymous' } = await readBody(event)

   if (!message?.trim()) {
      throw createError({ statusCode: 400, message: 'Zpráva je povinná' })
   }

   // ← TADY obohacuješ zprávu (middleware logika)
   const enrichedText = `Jsi užitečný asistent v Nuxt 4 aplikaci.
Kontext: Česká webová aplikace.
Další instrukce: Odpovídej krátce, přátelsky a v češtině.

Uživatel řekl: ${message}`

   const reply = await sendToCopilot(enrichedText, conversationId)

   return {
      success: true,
      reply,
      conversationId,
   }
})