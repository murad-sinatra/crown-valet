# AGENTS.md

Guidance for AI agents and cloud development environments working on Crown Valet.

## Cursor Cloud specific instructions

### Architecture

Crown Valet is a **Docker-first** Nuxt 3 monolith. Local development runs two Compose services:

| Service | Port (default) | Purpose |
|---------|----------------|---------|
| `app` | `http://localhost:3001` | Nuxt dev server + Nitro API |
| `db` | `localhost:5433` | PostgreSQL 16 |

See `README.md` for the canonical commands (`docker:build`, `docker:dev`, `docker:db:*`, `docker:test`).

### Docker daemon (cloud VMs)

Cloud VMs may not have Docker running by default. If `docker` commands fail:

1. Ensure `dockerd` is running (storage driver `fuse-overlayfs` is required in nested containers).
2. Ensure your user can access `/var/run/docker.sock` (`sudo chmod 666 /var/run/docker.sock` or add user to `docker` group).

### First-time / fresh `node_modules` volume

After `npm run docker:db:generate`, link the custom Prisma output (`generated/prisma`) into the location `@prisma/client` expects:

```bash
docker compose exec app sh -c 'mkdir -p node_modules/.prisma && rm -rf node_modules/.prisma/client && ln -sf /app/generated/prisma node_modules/.prisma/client'
npm run docker:restart:app
```

Without this symlink, Nitro throws `Cannot find module '.prisma/client/default'` on startup.

### Recommended startup sequence

```bash
npm run docker:build          # after package-lock.json changes
npm run docker:dev:detached
npm run docker:db:generate    # + symlink step above on fresh volumes
npm run docker:db:migrate
npm run docker:db:seed
```

### Lint / test / build

| Task | Command | Notes |
|------|---------|-------|
| Unit tests | `npm run docker:test` | Vitest; runs inside `app` container |
| Static build (CI) | `docker compose run --rm --no-deps app npm run generate` | Avoid host `npm run generate` while the dev container is running — Docker creates root-owned `.nuxt` files that block host builds |
| Lint | *(none configured)* | No ESLint script in `package.json` |

Avoid running Nuxt, Prisma, or Postgres directly on the host unless debugging container setup (`README.md`).

### Pilot staff access

Staff auth is cookie-based for the MVP. On `/staff/login`, click **Enter staff operations** (sets `cv_staff_session=attendant@crownvalet.test`). Seeded users: `manager@crownvalet.test`, `attendant@crownvalet.test`, `runner@crownvalet.test`.

### Environment file

`README.md` references `.env.example`, but that file is not in the repo. Compose defaults in `docker-compose.yml` are sufficient for local development.
