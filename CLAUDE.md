# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev              # Start dev server with hot reload (uses tsx watch)
npm run build            # Build for production (tsc + tsc-alias)
npm run lint             # Lint and format check with Biome
npm run lint:fix         # Auto-fix lint and format issues
npm run format           # Format code with Biome

# Testing
npm test                 # Run all tests
npm run test:unit        # Run unit tests only (src/**/*.test.ts)
npm run test:integration # Run integration tests only (tests/**/*.test.ts)

# Database (requires --config flag)
npx prisma migrate deploy --config prisma/prisma.config.ts  # Apply migrations
npx prisma migrate dev --config prisma/prisma.config.ts     # Create new migration
npx prisma studio --config prisma/prisma.config.ts          # Database GUI
```

## Architecture

This is a Clean Architecture implementation.

### Layer Structure

```
src/
├── domain/           # Entities and repository interfaces (no dependencies)
│   ├── entities/     # Domain models
│   └── repositories/ # Repository interfaces
├── infrastructure/   # External concerns (implements domain interfaces)
│   ├── config/       # Configuration
│   ├── logger/       # Logging
│   ├── repositories/ # Repository implementations (Prisma)
│   └── di.ts         # Dependency injection setup
├── features/         # Feature modules with controllers and use cases
│   └── {feature}/
│       ├── {feature}-controller.ts  # Route definitions
│       ├── {operation}.ts           # Use case
│       └── __tests__/               # Collocated unit tests
├── plugins/          # Fastify plugins (error handler, swagger, health, DI)
├── app.ts            # App setup and plugin registration
└── server.ts         # Server entry point
```

### Path Aliases

- `@domain/*` → `src/domain/*`
- `@infrastructure/*` → `src/infrastructure/*`

### Feature Pattern

Features are organized under `src/features/{feature}/`:
- Controller file registers routes with Fastify schema validation
- Use case files contain business logic with Zod validation
- Each use case is a standalone async function that receives params and dependencies
- Use cases return discriminated union result types (success/error) for explicit error handling

Example use case structure:
```typescript
type CreateEntityResult = { type: 'success'; id: string } | { type: 'error' };

export async function createEntity(params: CreateEntityParams, { logger, repositories }: Dependencies): Promise<CreateEntityResult> {
  const validated = paramsSchema.parse(params);

  const entity = new Entity({ id: nanoid(), ...validated, createdAt: new Date() });
  const result = await repositories.entityRepository.create(entity);

  if (result.ok) {
    return { type: 'success', id: result.data.id };
  }

  return { type: 'error' };
}
```

### Exhaustive Pattern Matching

Controllers use `ts-pattern` for exhaustive matching on use case results. This ensures all result types are handled at compile time:

```typescript
import { match } from 'ts-pattern';

return match(result)
  .with({ type: 'success' }, ({ id }) => reply.status(201).send({ id }))
  .with({ type: 'error' }, () => reply.status(500).send({ message: 'Internal server error', statusCode: 500 }))
  .exhaustive();
```

The `.exhaustive()` call causes a compile-time error if any result type is unhandled.

### Dependency Injection

Dependencies are created in `src/infrastructure/di.ts` via `makeDependencies()`. Access in controllers via:
```typescript
const result = await createEntity(params, fastify.dependencies);
```

The `Dependencies` type is exported from `@infrastructure/di` for use in use cases.

### Plugins

Fastify plugins in `src/plugins/`:
- `dependency-injection.ts` - Registers dependencies on fastify instance
- `error-handler.ts` - Global error handling with RFC 7231 compliant responses
- `swagger.ts` - OpenAPI documentation
- `health.ts` - Health check endpoint
- `rate-limit.ts` - Request rate limiting

### Testing

- **Unit tests**: Collocated in `src/features/**/__tests__/*.test.ts`, mock dependencies
- **Integration tests**: In `tests/`, use real Fastify instance with Prisma test environment

### Validation Strategy

Validation occurs at two layers:

1. **Controller (Fastify Schema)**: JSON Schema validation for request/response. Provides OpenAPI documentation and fast rejection of malformed requests.

2. **Use Case (Zod)**: Business rule validation with type inference. Zod schemas are the source of truth for validation logic.

Domain entities are intentionally simple data containers without internal validation. This is a deliberate design choice: validation happens at the use case boundary (via Zod) before entity construction, ensuring invalid entities cannot be created. This avoids triple-validation overhead while maintaining a single source of truth for business rules.
