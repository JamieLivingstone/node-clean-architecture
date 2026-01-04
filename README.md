# Node Clean Architecture

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://github.com/JamieLivingstone/node-clean-architecture/blob/main/LICENSE)
[![Known Vulnerabilities](https://snyk.io/test/github/JamieLivingstone/node-clean-architecture/badge.svg)](https://snyk.io/test/github/JamieLivingstone/node-clean-architecture)

A production-ready Node.js template following Clean Architecture principles with CQRS pattern, designed for scalability and maintainability.

---

## ✨ Features

- **TypeScript First** — Full TypeScript support with strict type checking
- **Clean Architecture** — Clear separation between Domain, Application, Infrastructure, and Web layers
- **CQRS Pattern** — Command Query Responsibility Segregation for scalable read/write operations
- **Dependency Injection** — Awilix container for inversion of control
- **High Performance** — Built on Fastify for maximum throughput ([benchmarks](https://www.fastify.io/benchmarks))
- **Prisma ORM** — Type-safe database access with migrations
- **API Documentation** — Auto-generated Swagger/OpenAPI docs
- **Structured Logging** — JSON logging with Pino
- **Comprehensive Testing** — Unit and functional test setup with Jest

---

## 🚀 Getting Started

### Prerequisites

- [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager)
- [Docker](https://www.docker.com/) running locally

### Installation

1. Install Node.js via nvm
   ```bash
   nvm install
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
   npx prisma migrate deploy
   ```

6. Start development server
   ```bash
   npm run dev
   ```

7. Navigate to Swagger
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
npm run test:functional  # Run functional/API tests
```

### Database

```bash
npx prisma migrate deploy  # Apply pending migrations
npx prisma migrate dev     # Create a new migration
npx prisma studio          # Open database GUI
```

---

## 📁 Project Structure

```
src/
├── domain/           # Core business entities (no external dependencies)
├── application/      # Use cases organized as commands and queries
├── infrastructure/   # Database, configuration, dependency injection
└── web/              # Fastify routes and HTTP handling
```

---

## 📄 License

This project is licensed under the [MIT License](https://github.com/JamieLivingstone/node-clean-architecture/blob/main/LICENSE).