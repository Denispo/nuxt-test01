<script setup lang="ts">
import {computed} from "vue";

const message = ref('chtěl bych jet příští měsíc s manželkou k moři')

type Reply = undefined | {
   "data":[
      {
         "obsazenost":string
      },
      {
         "destinations":[
            {
               "item":string
            },
            {
               "item":string
            }
         ]
      },
      {
         "delka":string,
         "poznamka":string,
         "okno_dovolene":{
            "od":string,
            "do":string
         }
      }
   ]
}

const reply = ref<Reply>(undefined);
const errorMesasge = ref<string>("");
const loading = ref(false)

const sendMessage = async () => {
   if (!message.value.trim() || loading.value) return

   loading.value = true
   reply.value = undefined
   errorMesasge.value = ''

   try {
      const res = await $fetch('/api/chat', {
         method: 'POST',
         body: { message: message.value },
         timeout: 20000
      })
      if (res.reply?.message) {
         errorMesasge.value = res.reply?.message
      } else {
         try {
            reply.value = JSON.parse(res.reply);
         } catch (e) {
            errorMesasge.value = res.reply;
         }
      }
   } catch (e: any) {
      errorMesasge.value = 'Chyba: ' + (e.data?.message || e.message)
   } finally {
      loading.value = false
   }
}

const data = computed<any>(()=>{
   let result:Record<any, any> | undefined = undefined;
   if (!reply.value?.data){
    return;
   }
   result = {};
   for (const oneItem of reply.value.data) {
      result = {...result,...oneItem}
   }
   console.log({...result})
   return result;
})

const destinace = computed<string>(()=>{
   let result: string = "";

   if (data.value) {
      result = data.value.destinations.map((value:any)=>{
         return value.item
      }).join(', ')
   }
   return result;
})
</script>

<template>
   <div style="max-width: 600px; margin: 40px auto; padding: 20px; font-family: system-ui">
      <h1>Kdy, kam a s kým chcete na dovolenou?</h1>

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
         <div style="display: flex; flex-flow: column; gap: 5px">
            <p style="margin: 0">Destinace: <strong>{{destinace}}</strong></p>
            <p style="margin: 0">Obsazenost: <strong>{{data.obsazenost}}</strong></p>
            <p style="margin: 0">Termín: od <strong>{{data.okno_dovolene.od?? 'NA'}}</strong> do <strong>{{data.okno_dovolene.do?? 'NA'}}</strong></p>
            <p style="margin: 0">Délka: <strong>{{data.delka}}</strong></p>
         </div>
         <p style="margin-top: 20px; color: dimgrey">Reasoning: {{data.poznamka}}</p>
      </div>
      {{errorMesasge}}
   </div>
</template>