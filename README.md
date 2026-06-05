# Crown Valet

Crown Valet is a Nuxt 3 web MVP for a premium valet operations platform. The first build focuses on the core valet loop: staff check-in, digital ticket, status updates, pickup queue, manager visibility, and durable session history.

## Docker-First Setup

All development and runtime workflows should run through Docker containers.

Create a local environment file:

```bash
cp .env.example .env
```

Build and start the app plus PostgreSQL:

```bash
npm run docker:build
npm run docker:dev
```

Or run the stack in the background:

```bash
npm run docker:dev:detached
npm run docker:logs
```

Run database commands inside the app container:

```bash
npm run docker:db:generate
npm run docker:db:migrate
npm run docker:db:seed
```

Run tests inside the app container:

```bash
npm run docker:test
```

The app runs at `http://localhost:3001` and PostgreSQL is exposed on `localhost:5433` for local tooling by default.

## Docker Hot Reload

Nuxt dev mode runs inside the `app` container with polling-based file watching enabled for Docker Desktop. Edits to Vue pages, components, styles, server files, and shared modules are bind-mounted into the container and should hot reload automatically in the browser.

The default hot-reload settings are in `.env.example`:

```bash
APP_PORT=3001
NUXT_HMR_CLIENT_PORT=3001
NUXT_DEV_WATCH_POLLING=true
CHOKIDAR_USEPOLLING=true
CHOKIDAR_INTERVAL=250
WATCHPACK_POLLING=true
```

If dependency changes or generated files do not appear, restart only the app container:

```bash
npm run docker:restart:app
```

## Local Notes

The app container uses Node.js 20.19.0 to match `package.json`. Avoid running Nuxt, Prisma, tests, or PostgreSQL directly on the host machine unless you are debugging container setup.
