# JadeQuote

Solar financing pre-qualification.

## Setup

This is a Next.js application with PostgreSQL database and Keycloak authentication dependencies. You'll need Node.js, npm, and Docker installed on your machine.

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file (no changes needed for local dev):
cp .env.example .env

# 3. Start services (PostgreSQL + Keycloak):
docker compose up -d

# 4. Run database migrations:
npm run db:migrate
```

## Run/Develop

Start the vite dev server with HMR (requires Docker services from setup step 3):

```bash
npm run dev
```

Access the app at http://localhost:3000 and login with `user@example.com` / `password` (regular user) or `admin@example.com` / `password` (admin user).

### Database migrations:

If you modify `src/infra/db/schema.ts`, generate a new migration with `npm run db:generate` and apply it with `npm run db:migrate`.

## Test

Run tests, linter, and formatter:

```bash
npm run check
```

## Keycloak Admin Interface

Access Keycloak admin interface at http://localhost:8080 with credentials `admin` / `admin` (Keycloak system admin, not application user)

**Note:** If changes made to `keycloak/jade-dev-realm.json`, run `docker compose down -v` to remove volumes before restarting.

## API Documentation

To access the API documentation, start the application and navigate to http://localhost:3000/docs (Swagger UI) or http://localhost:3000/openapi.yaml (raw spec) in your browser.
