# Clean Architecture Template

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://github.com/JamieLivingstone/node-clean-architecture/blob/main/LICENSE)
[![Test Coverage](https://api.codeclimate.com/v1/badges/f2520d575fe754ae7032/test_coverage)](https://codeclimate.com/github/JamieLivingstone/node-clean-architecture/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/f2520d575fe754ae7032/maintainability)](https://codeclimate.com/github/JamieLivingstone/node-clean-architecture/maintainability)
[![Known Vulnerabilities](https://snyk.io/test/github/JamieLivingstone/node-clean-architecture/badge.svg)](https://snyk.io/test/github/JamieLivingstone/node-clean-architecture)

A Node template that follows the Clean Architecture principles and encourages established practices.

## Features

- TypeScript first
- Dependency injection via Awilix
- CQRS (Command Query Responsibility Segregation)
- High test coverage (unit and integration tests)
- Automatic error handling
- Logging
- Versioned APIs
- Swagger
- Prisma ORM

## Getting Started

1. Install the latest [Node.js LTS](https://nodejs.org/en/)
2. Install Docker and ensure that it is running
3. Create .env file `cp .env.example .env`
4. Install project dependencies by running `npm install`
5. Start Docker (local Postgres instance) `docker-compose up -d`
6. Create database `npx prisma migrate deploy`
7. Start development server `npm start`
8. Navigate to Swagger ([ http://localhost:3000/api-docs](http://localhost:3000/api-docs))

## Scripts

**Build production bundle**

```
npm run build
```

**Lint project (eslint)**

```
npm run lint
```

**Start development server**

```
npm start
```

**Run all tests**

```
npm test
```

**Run unit tests**

```
npm run test:unit
```

**Run integration tests (API tests)**

```
npm run test:integration
```

## License

[This project is licensed with the MIT license.](https://github.com/JamieLivingstone/node-clean-architecture/blob/main/LICENSE)

## Credits

The project's inspiration is [Jason Taylor's clean architecture template](https://github.com/jasontaylordev/CleanArchitecture) for C#.
