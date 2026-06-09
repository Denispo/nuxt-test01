export default defineEventHandler(async (event) => {
   const { message } = await readBody(event)

   if (!message?.trim()) {
      throw createError({ statusCode: 400, message: 'Zpráva je povinná' })
   }

   const secret = process.env.DIRECTLINE_SECRET
   if (!secret) {
      throw createError({ statusCode: 500, message: 'Chybí DIRECTLINE_SECRET v .env' })
   }

   // 1. Vygenerujeme token
   const tokenRes = await $fetch('https://directline.botframework.com/v3/directline/tokens/generate', {
      method: 'POST',
      headers: {
         Authorization: `Bearer ${secret}`,
      },
   })

   const token = (tokenRes as any).token

   // 2. Začneme novou konverzaci (důležité!)
   const convRes = await $fetch('https://directline.botframework.com/v3/directline/conversations', {
      method: 'POST',
      headers: {
         Authorization: `Bearer ${token}`,
         'Content-Type': 'application/json',
      },
      body: {},
   })

   const conversationId = (convRes as any).conversationId   // ← TADY BYLA CHYBA (dříve .id)

   // 3. Pošleme zprávu uživatele
   await $fetch(`https://directline.botframework.com/v3/directline/conversations/${conversationId}/activities`, {
      method: 'POST',
      headers: {
         Authorization: `Bearer ${token}`,
         'Content-Type': 'application/json',
      },
      body: {
         type: 'message',
         from: { id: 'user', role: 'user' },
         text: message.trim(),
      },
   })

   // 4. Polling na odpověď (max ~10 sekund)
   let watermark = ''
   for (let i = 0; i < 20; i++) {
      await new Promise(resolve => setTimeout(resolve, 500))

      const activitiesRes = await $fetch(
         `https://directline.botframework.com/v3/directline/conversations/${conversationId}/activities?watermark=${watermark}`,
         {
            headers: { Authorization: `Bearer ${token}` },
         }
      ) as any

      watermark = activitiesRes.watermark || ''

      const botMessages = activitiesRes.activities?.filter((a: any) =>
         a.type === 'message' &&
         a.from?.role === 'bot' &&
         a.text?.trim()
      ) || []

      if (botMessages.length > 0) {
         return {
            reply: botMessages.map((m: any) => m.text).join('\n\n')
         }
      }
   }

   return { reply: 'Agent neodpověděl včas (zkus to znovu).' }
})