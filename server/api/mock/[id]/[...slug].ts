import {createHash} from "node:crypto";

export default defineEventHandler(async (event) => {
   const data = event.context.params?.slug ?? "";

   return {
      slug:data
   }
})