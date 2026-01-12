# Node Clean Architecture

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://github.com/JamieLivingstone/node-clean-architecture/blob/main/LICENSE)
[![Known Vulnerabilities](https://snyk.io/test/github/JamieLivingstone/node-clean-architecture/badge.svg)](https://snyk.io/test/github/JamieLivingstone/node-clean-architecture)

A production-ready Node.js template following Clean Architecture principles, designed for scalability and maintainability.

---

## ✨ Features

- **Modern Stack** — Fastify, Prisma, Zod, Vitest, Biome, and TypeScript
- **High Performance** — Built on Fastify for maximum throughput ([benchmarks](https://www.fastify.io/benchmarks))
- **Type Safe** — Strict TypeScript with runtime validation via Zod
- **Database Ready** — Prisma ORM with migrations and type-safe queries
- **API Documentation** — Auto-generated Swagger/OpenAPI from route schemas
- **Production Ready** — Structured logging, rate limiting, security headers, health checks
- **Test First** — Unit and integration testing with isolated database schemas

---

## 🚀 Getting Started

### Prerequisites

- [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager)
- [Docker](https://www.docker.com/) running locally

### Installation

1. Install and use Node.js via nvm
   ```bash
   nvm install
   nvm use
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create environment file
   ```bash
   cp .env.example .env
   ```

4. Start PostgreSQL database
   ```bash
   docker compose up -d
   ```

5. Run database migrations
   ```bash
   npx prisma migrate deploy --config prisma/prisma.config.ts
   ```

6. Generate Prisma client
   ```bash
   npx prisma generate --config prisma/prisma.config.ts
   ```

7. Start development server
   ```bash
   npm run dev
   ```

8. Navigate to Swagger
   **[http://localhost:3000/api-docs](http://localhost:3000/api-docs)**

---

## 📜 Scripts

### Development

```bash
npm run dev       # Start dev server with hot reload
npm run build     # Build for production
```

### Code Quality

```bash
npm run lint      # Check for lint and format issues
npm run lint:fix  # Auto-fix lint and format issues
npm run format    # Format code with Biome
```

### Testing

```bash
npm test                 # Run all tests
npm run test:unit        # Run unit tests only
npm run test:integration # Run integration tests
```

### Database

```bash
npx prisma migrate deploy --config prisma/prisma.config.ts  # Apply pending migrations
npx prisma migrate dev --config prisma/prisma.config.ts     # Create a new migration
npx prisma studio --config prisma/prisma.config.ts          # Open database GUI
```

---

## 🏛️ Clean Architecture

This template implements [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) principles:

| Layer              | Purpose                                         | Dependencies           |
|--------------------|-------------------------------------------------|------------------------|
| **Domain**         | Business logic, entities, repository interfaces | None                   |
| **Infrastructure** | Database, logging, external services            | Domain                 |
| **Features**       | Use cases and HTTP controllers                  | Domain, Infrastructure |

**The Dependency Rule**: Source code dependencies point inward. Domain knows nothing about infrastructure or HTTP.

---

## 📁 Project Structure

```
src/
├── domain/           # Core business logic (no dependencies)
│   ├── entities/     # Domain models
│   └── repositories/ # Repository interfaces
├── infrastructure/   # External concerns
│   ├── config/       # Environment configuration
│   ├── logger/       # Structured logging
│   ├── repositories/ # Repository implementations
│   └── di.ts         # Dependency injection
├── features/         # Application use cases
│   └── {feature}/
│       ├── {feature}-controller.ts  # HTTP routes
│       └── {operation}.ts           # Business operations
├── plugins/          # Fastify plugins
├── app.ts            # Application setup
└── server.ts         # Entry point
```

---

## 📄 License

This project is licensed under the [MIT License](https://github.com/JamieLivingstone/node-clean-architecture/blob/main/LICENSE).
