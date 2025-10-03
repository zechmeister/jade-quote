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

Access the app at http://localhost:3000 and login with `user@test.com` / `password` (regular user) or `admin@test.com` / `password` (admin user).

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

## Design & Architecture

**Architecture**: Ports and adapters (Hexagonal) focusing on dependency-free domain layer. Business logic lives in pure, testable domain functions, with infrastructure (database, auth) adapters. More boilerplate, e.g. `QuoteService` needs a `QuoteRepo`, which is implemented by `PostgresQuoteRepo` but this makes adapters pluggable. Wiring up (Dependency Injection) for next via single `src/app/provide.ts`.

**Database**: Drizzle ORM for type-safe queries and SQL migration generation for deployment.

**Authentication**: Keycloak (enterprise OIDC/SSO) with NextAuth v5 for session management, user registration and role-based access control. A realm config for development with client, roles, seed users is checked in (`keycloak/jade-dev-realm.json`) and is imported on start up. Users are mirrored to local database on quote creation to enable filtering without Keycloak round-trips. Note: True BFF pattern would require server-side session storage (e.g. redis) to avoid JWT in cookies. Took time setting up, but login/registration out of the box.

### Next/Missing

- Deployable artifact (multi-step Dockerfile)
- CI on push, that runs checks and verifies image can be build (e.g. github action)
- auto-generated API docs
- Design Auth concept, so server components can also use domain services (currently, auth is only checked at api endpoints)
