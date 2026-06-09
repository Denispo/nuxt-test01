<script setup lang="ts">
const message = ref('')
const reply = ref('')
const loading = ref(false)

const sendMessage = async () => {
   if (!message.value.trim() || loading.value) return

   loading.value = true
   reply.value = ''

   try {
      const res = await $fetch('/api/chat', {
         method: 'POST',
         body: { message: message.value }
      })
      reply.value = res.reply
   } catch (e: any) {
      reply.value = 'Chyba: ' + (e.data?.message || e.message)
   } finally {
      loading.value = false
   }
}
</script>

<template>
   <div style="max-width: 600px; margin: 40px auto; padding: 20px; font-family: system-ui">
      <h1>Minimální Copilot Chat (Nuxt 4)</h1>

      <textarea
         v-model="message"
         rows="3"
         placeholder="Napiš zprávu..."
         style="width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 6px"
      />

      <button
         @click="sendMessage"
         :disabled="loading"
         style="margin-top: 12px; padding: 12px 24px; background: #0078d4; color: white; border: none; border-radius: 6px; cursor: pointer"
      >
         {{ loading ? 'Čekám na odpověď...' : 'Odeslat →' }}
      </button>

      <div v-if="reply" style="margin-top: 30px; padding: 20px; background: #f0f0f0; border-radius: 8px; white-space: pre-wrap">
         <strong>AI odpověď:</strong><br><br>
         {{ reply }}
      </div>
   </div>
</template>