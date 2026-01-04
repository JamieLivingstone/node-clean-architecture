# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev              # Start dev server with hot reload (uses tsx watch + pino-pretty)
npm run build            # Build for production (tsc + tsc-alias)
npm run lint             # Lint and format check with Biome
npm run lint:fix         # Auto-fix lint and format issues
npm run format           # Format code with Biome

# Testing
npm test                 # Run all tests
npm run test:unit        # Run unit tests only (src/**/*.test.ts)
npm run test:functional  # Run functional/API tests only (tests/**/*.test.ts)

# Run single test file
npx jest path/to/file.test.ts

# Run tests matching pattern
npx jest --testNamePattern="pattern"

# Database
npx prisma migrate deploy  # Apply migrations
npx prisma migrate dev     # Create new migration
npx prisma studio          # Database GUI
```

## Architecture

This is a Clean Architecture implementation with CQRS pattern.

### Layer Structure

```
src/
├── domain/           # Entities (no dependencies)
├── application/      # Use cases with commands/queries (depends on domain)
├── infrastructure/   # External concerns: DB, config, DI (implements application interfaces)
└── web/              # Fastify HTTP layer (depends on all layers)
```

### Path Aliases

- `@domain/*` → `src/domain/*`
- `@application/*` → `src/application/*`
- `@infrastructure/*` → `src/infrastructure/*`
- `@web/*` → `src/web/*`

### CQRS Pattern

Features are organized under `src/application/{feature}/`:
- `commands/` - Write operations (create, update, delete)
- `queries/` - Read operations

Each command/query follows this structure:
```
{operation}/
├── index.ts                    # Public exports
├── {operation}-command.ts      # Handler with makeXxxCommand factory
├── {operation}-command-validator.ts  # Zod schema validation
└── __tests__/                  # Collocated unit tests
```

Queries include `*-mapper.ts` files to convert entities to DTOs.

### Dependency Injection

Awilix container configured in `src/infrastructure/di.ts`. Access dependencies in routes via:
```typescript
const { postsRepository, logger } = fastify.diContainer.cradle;
```

Use cases are created with `makeXxxUseCases(fastify.diContainer.cradle)` pattern.

### Routes

Routes auto-loaded from `src/web/routes/` via Fastify AutoLoad. Each route file exports a default async function that registers endpoints. Routes directly call application use cases (no separate controller layer).

### Testing

- **Unit tests**: Collocated in `src/**/__tests__/*.test.ts`, mock dependencies
- **Functional tests**: In `tests/api/`, use real Fastify instance with Prisma test environment

Functional tests use `makeClient()` helper from `tests/helpers.ts` to create test app instance.
