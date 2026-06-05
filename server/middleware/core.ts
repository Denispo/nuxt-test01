import { defineEventHandler, setResponseHeaders, setResponseStatus } from 'h3'

export default defineEventHandler((event) => {
   // Pouze pro tvé public API (můžeš upravit podle potřeby)
   if (!event.path.startsWith('/api/')) {
      return
   }

   // Nastavíme permissive CORS pro libovolné weby
   setResponseHeaders(event, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': '*',           // nebo konkrétní: 'Content-Type, Authorization, X-Custom-Header'
      'Access-Control-Max-Age': '0',                 // pro development (v produkci můžeš dát 86400)
      'Access-Control-Allow-Credentials': 'false',   // protože používáme *
   })

   // ← TOTO je klíčové pro preflight
   if (event.method === 'OPTIONS') {
      setResponseStatus(event, 204)   // No Content
      return null                     // nebo '' – důležité, aby se nevolal další handler
   }
})