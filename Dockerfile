FROM node:20.19.0-bookworm-slim AS base

WORKDIR /app

ENV NODE_ENV=development
ENV DATABASE_URL=postgresql://crown_valet:crown_valet@db:5432/crown_valet?schema=public

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run db:generate

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
