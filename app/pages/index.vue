<script setup lang="ts">
const messages = ref<{ role: 'user' | 'assistant'; content: string }[]>([])
const newMessage = ref('')
const conversationId = ref(`chat-${Date.now()}`)

// Reaktivní payload
const payload = ref({
   message: '',
   conversationId: '',
   userId: 'anonymous' as string,
})

// ← TYPY pro odpověď z API (řeší TS2339)
interface ApiResponse {
   success: boolean
   reply: string
   conversationId?: string
}

const { data, pending, error, execute } = useFetch<ApiResponse>('/api/sendmessage', {
   method: 'POST',
   body: payload,
   immediate: false,
   server: false,
})

const sendMessage = async () => {
   if (!newMessage.value.trim() || pending.value) return

   // Přidáme zprávu uživatele ihned
   messages.value.push({
      role: 'user',
      content: newMessage.value,
   })

   const userText = newMessage.value
   newMessage.value = ''

   // Aktualizujeme payload
   payload.value = {
      message: userText,
      conversationId: conversationId.value,
      userId: 'current-user', // ← zde můžeš použít auth.user?.id
   }

   // Spustíme request
   await execute()

   // Zpracujeme odpověď – teď už s plnými typy
   if (error.value) {
      console.error('Chyba:', error.value)
      messages.value.push({
         role: 'assistant',
         content: 'Omlouvám se, něco se pokazilo. Zkus to znovu.',
      })
      return
   }

   if (data.value?.reply) {
      messages.value.push({
         role: 'assistant',
         content: data.value.reply,
      })

      // Aktualizace conversationId (volitelná vlastnost)
      if (data.value.conversationId) {
         conversationId.value = data.value.conversationId
      }
   }
}
</script>

<template>
   <div class="chat-container">
      <div v-for="(msg, i) in messages" :key="i" class="message">
         <strong v-if="msg.role === 'user'">Ty:</strong>
         <strong v-else>Copilot:</strong>
         <p>{{ msg.content }}</p>
      </div>

      <!-- Loading indikátor -->
      <div v-if="pending" class="loading">Copilot přemýšlí...</div>

      <form @submit.prevent="sendMessage">
         <input
            v-model="newMessage"
            placeholder="Napiš zprávu..."
            :disabled="pending"
         />
         <button type="submit" :disabled="pending || !newMessage.trim()">
            Odeslat
         </button>
      </form>
   </div>
</template>