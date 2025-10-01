# JadeQuote

## Prerequisites for Development

```bash
npm i
cp .env.example .env
docker compose up -d
```

**Note:** If changes made to `keycloak/jade-realm.json`, run `docker compose down -v` to remove volumes before restarting.

## Database

Generate migrations:

```bash
npm run db:generate
```

Apply migrations:

```bash
npm run db:migrate
```

**Note:** Use `npx drizzle-kit studio` to inspect the database.

## Run Dev Environment

Start the dev server:

```bash
npm run dev
```

Run linter, formatter and tests:

```bash
npm run check
```
