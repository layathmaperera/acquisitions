# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Node.js REST API built with Express 5 for user authentication and acquisitions management. Uses Drizzle ORM with Neon PostgreSQL (serverless) for data persistence.

## Commands

```bash
# Development (with watch mode)
npm run dev

# Linting
npm run lint
npm run lint:fix

# Formatting
npm run format
npm run format:check

# Database operations
npm run db:generate   # Generate migration from schema changes
npm run db:migrate    # Apply migrations to database
npm run db:studio     # Open Drizzle Studio GUI
```

## Architecture

```
Request → Route → Controller → Service → Drizzle Model → Neon PostgreSQL
                      ↓
              Zod Validation
```

### Layer Responsibilities

- **Routes** (`src/routes/`): Define endpoints and wire to controllers
- **Controllers** (`src/controllers/`): Handle HTTP request/response, validate input with Zod, call services
- **Services** (`src/services/`): Business logic, database operations via Drizzle
- **Models** (`src/models/`): Drizzle schema definitions (used by `drizzle.config.js` for migrations)
- **Validations** (`src/validations/`): Zod schemas for request validation

### Path Aliases

The project uses Node.js subpath imports defined in `package.json`:

```javascript
import logger from '#config/logger.js';
import { signup } from '#controllers/auth.controllers.js';
import { users } from '#models/user.model.js';
import { createUser } from '#Services/auth.service.js';
import { signupSchema } from '#validations/auth.validations.js';
```

Note: `#Services/*` is capitalized in the import map.

## Key Patterns

### Adding a New Endpoint

1. Define Zod schema in `src/validations/`
2. Create service function in `src/services/`
3. Create controller in `src/controllers/` that validates input and calls service
4. Add route in `src/routes/` and register in `src/app.js`

### Adding a Database Table

1. Define Drizzle schema in `src/models/`
2. Run `npm run db:generate` to create migration
3. Run `npm run db:migrate` to apply

### Authentication Flow

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens signed with HS256, stored in httpOnly cookies
- Token payload: `{ id, email, role }`

## Code Style

- ES Modules (`import`/`export`)
- Single quotes, 2-space indent, semicolons required
- Use `const`/`let`, no `var`
- Prefix unused params with `_` (e.g., `_req`)

## Environment Variables

Required in `.env`:
- `DATABASE_URL` - Neon PostgreSQL connection string
- `JWT_SECRET` - Secret for signing JWT tokens
- `JWT_EXPIRES_IN` - Token expiration (default: `1d`)
- `PORT` - Server port (default: `3000`)
- `NODE_ENV` - `development` or `production`
- `LOG_LEVEL` - Winston log level (default: `info`)
