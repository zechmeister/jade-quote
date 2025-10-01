# JadeQuote

## Prerequisites for Development

### 1. Install Dependencies

```bash
npm i
```

### 2. Setup Environment Variables

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

### 3. Start Keycloak

Start the required services using Docker Compose:

```bash
docker compose up -d
```

## Run Dev Environment

Start the dev server:

```bash
npm run dev
```

Run linter, formatter and tests:

```bash
npm run check
```
