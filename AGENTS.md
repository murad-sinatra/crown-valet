# AGENTS.md

Guidance for AI agents and cloud development environments working on Crown Valet.

## Cursor Cloud specific instructions

### Architecture

Crown Valet is a **Docker-first** Next.js monolith. Local development runs two Compose services:

| Service | Port (default) | Purpose |
|---------|----------------|---------|
| `app` | `http://localhost:3001` | Next.js dev server + Route Handlers |
| `db` | `localhost:5433` | PostgreSQL 16 |

See `README.md` for the canonical commands (`docker:build`, `docker:dev`, `docker:db:*`, `docker:test`).

### Docker daemon (cloud VMs)

Cloud VMs may not have Docker running by default. If `docker` commands fail:

1. Ensure `dockerd` is running (storage driver `fuse-overlayfs` is required in nested containers).
2. Ensure your user can access `/var/run/docker.sock` (`sudo chmod 666 /var/run/docker.sock` or add user to `docker` group).

### Recommended startup sequence

```bash
npm run docker:build          # after package-lock.json changes
npm run docker:dev:detached
npm run docker:db:migrate
npm run docker:db:seed
```

### Lint / test / build

| Task | Command | Notes |
|------|---------|-------|
| Unit tests | `npm run docker:test` | Vitest; runs inside `app` container |
| Production build | `docker compose run --rm --no-deps app npm run build` | Avoid host `npm run build` while the dev container is running if file ownership conflicts appear |
| Lint | *(none configured)* | No ESLint script in `package.json` |

Avoid running Next.js, Drizzle migrations, or Postgres directly on the host unless debugging container setup (`README.md`).

### Pilot staff access

Staff auth is cookie-based for the MVP. Seeded users: `manager@crownvalet.test`, `attendant@crownvalet.test`, `runner@crownvalet.test` (passwords in `scripts/seed.ts`).

### Environment file

`README.md` references `.env.example`, but that file is not in the repo. Compose defaults in `docker-compose.yml` are sufficient for local development.
