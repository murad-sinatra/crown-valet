# Crown Valet — Build & Deployment Log

## What Was Built

### 1. Email / Password Authentication
**Problem:** The app had a placeholder "pilot mode" login that set a hardcoded cookie with no real credentials.

**What was added:**
- `passwordHash` column on the `staff_users` table (scrypt via Node.js built-in `crypto` — no new dependencies)
- `POST /api/auth/login` — validates email + password, sets an `httpOnly` session cookie storing the user's ID
- `POST /api/auth/logout` — clears the cookie
- Login page replaced with a real email + password form
- Seed updated to set initial passwords for test accounts (`attendant1234`, `runner1234`, `manager1234`)

### 2. Profile Page with Password Reset
- `GET /api/staff/me` — returns the currently authenticated user
- `POST /api/staff/change-password` — verifies current password before setting a new one (min 8 chars)
- `/staff/profile` page: shows name/email/role, password change form, and sign-out button
- Profile link added to the top navigation

### 3. Customer Ticket Page + Service Requests
**Problem:** The `/ticket/[token]` page was an empty placeholder.

**What was added:**
- `ServiceRequest` model with types: `gas_fillup`, `ev_charge`, `clean`, `tire_check`, `other`
- `GET /api/ticket/[token]` — public endpoint (no auth), looks up session by hashed token, returns customer-safe data
- `POST /api/ticket/[token]/service-request` — customer submits a service request
- Full customer ticket page (mobile-first):
  - Live status badge (color-coded per session state)
  - Vehicle info + parking location chips
  - Service request grid with bottom-sheet panel and notes field
  - Timeline of customer-visible events
  - Tap-to-call valet button
- Staff session detail page updated to show a service requests table

---

## Bugs Fixed During Deployment

### Bug 1: SSR Crash — `Cannot access 'renderer$1' before initialization`
**Symptom:** Opening any page crashed the server with a cryptic `renderer$1` temporal dead zone error.

**Root cause (two layers):**
1. The Prisma schema had a custom `output = "../generated/prisma"`. Nuxt's dev bundler externalises Prisma imports and maps them to `@prisma/client` at runtime. `@prisma/client/default.js` then tries to load `node_modules/.prisma/client/default.js` — which only gets created when Prisma generates to the **default** location. With the custom output, this file never existed on a fresh build.
2. That Prisma load failure threw an uncaught exception partway through module initialisation, which meant `renderer$1` (the Nuxt SSR page renderer, defined later in the same bundle) was never initialised. Any subsequent page request tried to call it and hit a JavaScript temporal dead zone error.

**Why it worked locally but not on DigitalOcean:** Locally the Docker `node_modules` volume persisted an old version of the Prisma client (from before the custom output was added), so `node_modules/.prisma/client/default.js` already existed. On the droplet every `docker build` was fresh with no volume, so it was always missing.

**Fix:** Removed `output = "../generated/prisma"` from `schema.prisma`. `prisma generate` now writes to the default location and `@prisma/client` resolves correctly on every fresh build.

---

### Bug 2: `prisma migrate deploy` Failing in Production Container
**Symptom:** App container crashed in a restart loop with `The datasource.url property is required in your Prisma config file`.

**Root cause (two layers):**
1. `prisma.config.ts` used `env('DATABASE_URL')` from Prisma's own config loader, which reads from `.env` files on disk. In Docker the `DATABASE_URL` is injected as a container environment variable (from `docker-compose.prod.yml`) — not written to a `.env` file. So `env()` returned `undefined`.
2. `prisma.config.ts` was not being copied into the production Docker image at all, so even after switching to `process.env.DATABASE_URL`, Prisma couldn't find the config file and had no URL to use.

**Fix:**
- Changed `prisma.config.ts` to use `process.env.DATABASE_URL` instead of `env('DATABASE_URL')`
- Added `COPY --from=builder /app/prisma.config.ts ./` to the production stage in the Dockerfile

---

## Production Docker Setup

Two Docker Compose files:

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Local development — `nuxt dev` with HMR, file watching, volume mounts |
| `docker-compose.prod.yml` | Production — builds app, runs migrations on startup, `restart: unless-stopped` |

### Dockerfile Stages

```
base → development   (npm run dev, used by docker-compose.yml)
base → builder       (prisma generate + nuxt build)
builder → production (lean runtime: .output + node_modules + prisma files)
```

The production CMD: `prisma migrate deploy && node .output/server/index.mjs`
Migrations run automatically on every container start before the server accepts traffic.

### DigitalOcean Block Storage
Postgres data directory is bind-mounted to `/mnt/crown-valet-99` (the DO block storage volume), so database data survives container restarts and redeployments.

### Required `.env` on the Droplet

```env
POSTGRES_PASSWORD=your_password
DATABASE_URL=postgresql://crown_valet:your_password@db:5432/crown_valet
APP_PORT=3000
```

### Deploy Command

```bash
git pull
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up --build -d
```
