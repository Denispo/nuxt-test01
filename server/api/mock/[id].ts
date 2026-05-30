import {createHash} from "node:crypto";

export default defineEventHandler(async (event) => {
   const storage = useStorage('storage/mock');
   const hash = createHash('md5').update('/api/nasrat/data2?de=45&=fuj').digest('hex')
   const data = await storage.getItemRaw(hash)
   return data
})
