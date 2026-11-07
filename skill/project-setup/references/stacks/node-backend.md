# Profile: Node/TypeScript backend

Use for APIs, workers, and services built on Node.

| Concern | Default |
|---|---|
| Runtime | Node.js + TypeScript (strict) |
| Database | Neon-hosted PostgreSQL, the source of truth |
| ORM | Drizzle (schemas + type-safe queries) |
| Tests | Vitest; local PostgreSQL for database integration tests |
| Logging | Pino, structured JSON logs |
| Queues/cache | Redis + BullMQ, only where needed |
| Environments | Docker + Docker Compose |
| Architecture | Modular monolith first; microservices only with a concrete reason |

Also: explicit API contracts, runtime validation of external input, env-based config, version-pinned dependencies, clear dev/prod separation.

## Testing
Use Vitest for Node.js application tests. Mock external APIs and services with representative fixtures; tests must not make live third-party API calls. Focus unit tests on important business rules and edge cases, and add integration tests for meaningful boundaries such as routes, persistence, and service wiring. Database integration tests must use a local PostgreSQL instance, never Neon. Keep test configuration separate from development and production so tests cannot modify hosted data.

Keep tests focused and organized by feature or module. Prefer shared fixtures and helpers over duplicated setup, avoid giant test files and tests for trivial implementation details, and assert observable behavior rather than internal structure.

## Logging
Use Pino for structured application logs. Include useful context such as request or job identifiers, log at appropriate levels, and serialize errors consistently. Redact credentials, tokens, and other sensitive values; never log secrets. Avoid ad hoc `console` logging in application code.

## Infra choice
Small VPS/containers is the default when serverless isn't justified. Serverless (e.g. AWS Lambda with SST/Pulumi) is the alternative for spiky or event-driven load, or when there's no ops capacity, or when the user asks. Use Neon PostgreSQL for the database regardless of application hosting. Record the choice and reason in `docs/architecture.md`. Don't mix both without a reason.

## Layout
```
src/modules/<domain>/   one folder per domain (routes, service, schema, tests)
src/shared/             only genuinely shared code
docker-compose.yml      redis (+ other local services if needed)
```

## Database schema changes
Never create migration files, modify existing migration files, or run migration commands. If a requested schema change requires a migration, stop and ask for an approved alternative.
