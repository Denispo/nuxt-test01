export default defineEventHandler(async (event) => {
   const storage = useStorage('storage/mock');
   const body = await readBody(event);
   await storage.setItem(body.hash+'.json',body.data)
   return {
      message: 'ok'
   }
})
