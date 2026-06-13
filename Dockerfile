FROM node:20.19.0-bookworm-slim AS base

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci

COPY . .

# ── Development ───────────────────────────────────────────────────────────────
FROM base AS development

ENV NODE_ENV=development
ENV DATABASE_URL=postgresql://crown_valet:crown_valet@db:5432/crown_valet?schema=public

RUN npm run db:generate

EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ── Production build ──────────────────────────────────────────────────────────
FROM base AS builder

ENV NODE_ENV=production
# Placeholder URL lets prisma generate run at build time without a real database.
# The actual DATABASE_URL is injected at runtime via docker-compose.prod.yml.
ENV DATABASE_URL=postgresql://build-placeholder/placeholder

RUN npm run db:generate && npm run build

# ── Production runtime ────────────────────────────────────────────────────────
FROM node:20.19.0-bookworm-slim AS production

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production

COPY --from=builder /app/.output /app/.output
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma.config.ts ./
COPY --from=builder /app/prisma /app/prisma

EXPOSE 3000

# Run pending migrations then start the server
CMD ["sh", "-c", "npx prisma migrate deploy && node .output/server/index.mjs"]
