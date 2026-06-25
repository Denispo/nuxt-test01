<script setup lang="ts">
import {computed} from "vue";

const message = ref('chtěl bych jet příští měsíc s manželkou k moři')


const reply = ref<string>("");
const errorMesasge = ref<string>("");
const loading = ref(false)

async function sendMessage() {
   if (!message.value.trim() || loading.value) {
      return;
   }

   loading.value = true;
   reply.value = "";
   errorMesasge.value = '';

   try {
      const result = await $fetch('/api/azure', {
         method: 'POST',
         body: {
            message: message.value
         }
      })
      console.log("result", result)
      reply.value = result.response
   } catch (error) {
      console.error(error)
      errorMesasge.value = 'Došlo k chybě při komunikaci s agentem.'
   } finally {
      loading.value = false
   }


}

</script>

<template>
   <div style="max-width: 600px; margin: 40px auto; padding: 20px; font-family: system-ui">
      <h1>Kdy, kam a s kým chcete na dovolenou? (azure)</h1>

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
         <p>{{reply}}</p>
      </div>
      {{errorMesasge}}
   </div>
</template>