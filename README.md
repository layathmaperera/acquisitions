# Acquisitions API

Node.js REST API built with Express 5, Drizzle ORM, and Neon PostgreSQL.

## Prerequisites

- [Node.js 22+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Neon Account](https://console.neon.tech/)

## Getting Neon Credentials

1. Sign up at [Neon Console](https://console.neon.tech/)
2. Create a new project
3. Get your credentials:
   - **NEON_API_KEY**: Account Settings → API Keys
   - **NEON_PROJECT_ID**: Project Settings → General
   - **PARENT_BRANCH_ID**: Branches tab → Select branch → Copy ID
   - **DATABASE_URL**: Dashboard → Connection string

## Local Development (Neon Local)

Neon Local creates ephemeral database branches that auto-cleanup when containers stop.

### Setup

```bash
# Configure environment
cp .env.development .env
# Edit .env with your Neon credentials

# Start development
docker compose -f docker-compose.dev.yml up --build

# Run migrations (new terminal)
docker compose -f docker-compose.dev.yml exec app npm run db:migrate
```

API available at http://localhost:3000

### Commands

```bash
# Start
docker compose -f docker-compose.dev.yml up

# Stop
docker compose -f docker-compose.dev.yml down

# Logs
docker compose -f docker-compose.dev.yml logs -f app

# Rebuild
docker compose -f docker-compose.dev.yml up --build
```

## Production (Neon Cloud)

Production connects directly to Neon Cloud.

### Setup

```bash
# Configure environment
cp .env.production .env
# Edit .env with DATABASE_URL and JWT_SECRET

# Deploy
docker compose -f docker-compose.prod.yml up --build -d

# Run migrations
docker compose -f docker-compose.prod.yml exec app npm run db:migrate
```

### Commands

```bash
# Start
docker compose -f docker-compose.prod.yml up -d

# Stop
docker compose -f docker-compose.prod.yml down

# Logs
docker compose -f docker-compose.prod.yml logs -f
```

## Environment Variables

### Development

| Variable | Description |
|----------|-------------|
| `NEON_API_KEY` | Neon API key |
| `NEON_PROJECT_ID` | Neon project ID |
| `PARENT_BRANCH_ID` | Parent branch for ephemeral branches |
| `JWT_SECRET` | JWT signing secret |

### Production

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon Cloud connection string |
| `JWT_SECRET` | JWT signing secret |

## How It Works

The app auto-detects environment via `NODE_ENV`:

- **Development**: Connects to Neon Local proxy at `db:5432`
- **Production**: Uses `DATABASE_URL` for Neon Cloud

## Running Without Docker

```bash
npm install
cp .env.example .env
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/auth/sign-up` | Register |
| POST | `/api/auth/sign-in` | Login |
| POST | `/api/auth/sign-out` | Logout |
