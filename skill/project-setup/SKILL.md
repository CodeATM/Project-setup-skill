---
name: project-setup
description: Scaffold, plan, or extend any software project with a consistent engineering standard — principles, workflow, approval gates, reliability checklist, and self-documenting repo layout. Use whenever the user starts a new project or repo, asks for a project structure, bootstrap, AGENTS.md, architecture/docs scaffolding, a build spec or prompt for a coding agent, or reviews whether a stack choice, dependency, or architecture is overengineered. Use it even if they don't say "project setup" — any "let's start building X" or "set up X" counts. Includes a stack profile for Node/TypeScript backends and an agent-platform reference.
---

# Project Setup

A stack-agnostic standard for starting and shaping projects. Principles, workflow, and safety gates apply to **every** project. Stack defaults live in `references/stacks/` and only apply when they fit.

## 1. Principles (apply to everything)

KISS · SOLID · DRY · scalability without premature complexity · efficiency · maintainability · strict type safety and explicit contracts where the language supports it · security first (least privilege, authorization separate from authentication, secure defaults).

Hard dislikes: unnecessary dependencies, overengineering, tech adopted because it's fashionable. Every new dependency or abstraction needs a one-sentence justification. If you can't write one, don't add it.

Database default: use Neon-hosted PostgreSQL whenever choosing or adding a database. Preserve an existing project's database rather than switching providers without explicit direction.

## 2. Pick the stack profile

1. **Existing project?** Read it first. Follow its stack and conventions. Never introduce a second ORM, framework, or pattern without a valid reason, stated out loud.
2. **New project, stack stated or obvious?** Use it.
3. **New project, stack unclear?** Ask one short question, or pick the simplest fit and state the assumption.
4. Load the matching profile:
   - Node/TypeScript backend, APIs, workers → `references/stacks/node-backend.md`
   - AI agent / agent platform → also `references/agent-architecture.md`
   - Anything else (frontend, mobile, CLI, data, other languages) → no profile exists. Apply the principles with the smallest sensible stack, and say what you chose and why. Offer to record it as a new profile in `references/stacks/`.

## 3. Workflow (don't jump to generating files)

1. **Understand** — read code, structure, docs, dependencies, conventions.
2. **Plan** — requirements, affected modules, dependencies, risks, steps. Show the plan before non-trivial work.
3. **Respect existing architecture.**
4. **Implement incrementally** — small, focused components, one responsibility each.
5. **Validate** — run tests, lint, typecheck, build. Never assume code works because it looks right.
6. **Review** — security, duplicated logic, performance, side effects.
7. **Report** — what changed, files touched, tests run, open issues, anything needing human approval.

## 4. Permission levels

Technical access is not permission.

| Level | Behaviour |
|---|---|
| Read | Inspect, search, analyze, explain freely |
| Execute | Safe, reversible, scoped development tasks |
| Approval required | Destructive operations, production changes, external communications, sensitive actions |

Never create migration files, modify existing migration files, or run migration commands. If a requested schema change requires a migration, stop and ask for an approved alternative. No destructive data changes without approval. Protect secrets. Private by default. Validate and sanitize external input. Keep audit trails for sensitive operations.

## 5. Reliability checklist (for any service)

Structured logging · error handling · bounded retries · idempotency · queue failure handling and dead-letter queues where appropriate · explicit transaction boundaries · indexes for real query patterns · observability · tests · graceful failure and recovery.

## 6. Scaffold

Create what the project actually needs. Always: `README.md`, `AGENTS.md` (from `assets/AGENTS.md.template`, filled in for this project), `.env.example` (if any config exists).

Add as real content exists: `CHANGELOG.md`, `docs/architecture.md`, `docs/database.md`, `docs/security.md`, `docs/deployment.md`. Skip files with nothing real to say; no filler.

Rules: pin dependency versions, verify against official docs instead of memory, keep docs matching the implementation (update in the same change), separate dev and prod clearly, config from environment.

## 7. Output behaviour

Be blunt. If a requested approach is overengineered, fashionable, or breaks these principles, say so and propose the simpler option before building.
