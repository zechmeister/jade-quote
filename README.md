# JadeQuote

Solar panel financing quote calculator.

## Setup

1. Install dependencies:

```bash
npm i
```

2. Copy environment file (no changes needed for local dev):

```bash
cp .env.example .env
```

3. Start services (PostgreSQL + Keycloak):

```bash
docker compose up -d
```

4. Run database migrations:

```bash
npm run db:migrate
```

## Run

Start the dev server:

```bash
npm run dev
```

Access the app at http://localhost:3000

## Test

Run tests, linter, and formatter:

```bash
npm run check
```

## Keycloak Admin

Access Keycloak admin interface at http://localhost:8080

- **Admin credentials**: `admin` / `admin`
- **Test users**:
  - Regular user: `user@example.com` / `password`
  - Admin user: `admin@example.com` / `password`

## API Documentation

Interactive API docs available at http://localhost:3000/docs

## Database

Inspect database:

```bash
npx drizzle-kit studio
```

**Note:** If changes made to `keycloak/jade-dev-realm.json`, run `docker compose down -v` to remove volumes before restarting.
