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

EXPOSE 3000
CMD ["npm", "run", "dev"]

# ── Production build ──────────────────────────────────────────────────────────
FROM base AS builder

ENV NODE_ENV=production
RUN npm run build

# ── Production runtime ────────────────────────────────────────────────────────
FROM node:20.19.0-bookworm-slim AS production

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production

COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/public /app/public
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/db /app/db
COPY --from=builder /app/scripts /app/scripts
COPY --from=builder /app/lib /app/lib
COPY --from=builder /app/shared /app/shared
COPY --from=builder /app/tsconfig.json /app/tsconfig.json

EXPOSE 3000

CMD ["sh", "-c", "npm run db:deploy && npm run start"]
