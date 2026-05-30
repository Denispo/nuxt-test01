import {createHash} from "node:crypto";

export default defineEventHandler(async (event) => {
   const storage = useStorage('storage/mock');
   //const bodyRaw = await readRawBody(event)
   const hash = createHash('md5').update('/api/nasrat/data2?de=45&=fuj').digest('hex')

   storage.setItem(hash,'{"pepa":"nekokotuje"}')
   return {
      message: 'ok'
   }
})
