# https://x.com/i/grok?conversation=2060267600135741536
# syntax = docker/dockerfile:1

# === BUILD STAGE ===
FROM oven/bun:1-alpine AS base
WORKDIR /app

# Instalace závislostí (lepší cache + ignore-scripts)
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile --ignore-scripts

# Kopírování zdrojových souborů a build
COPY . .
# --bun zajistí, že build běží plně přes Bun runtime (doporučeno v Nuxt + Nitro docs)
RUN bun --bun run build

# === PRODUCTION STAGE ===
FROM oven/bun:1-alpine AS release
WORKDIR /app

# Přebíráme jen to nejnutnější (.output obsahuje vše pro SSR)
COPY --from=base /app/.output .output

ENV NODE_ENV=production
# Bezpečnost: běží jako ne-root uživatel (Coolify to podporuje)
USER bun

EXPOSE 3000

# Přesně podle Nitro Bun dokumentace
CMD ["bun", "run", ".output/server/index.mjs"]