# project-setup-skill

An installable skill that helps coding agents set up and extend software projects with consistent engineering practices. It covers project discovery, stack selection, architecture, implementation workflow, safety boundaries, validation, and documentation.

The package has no runtime dependencies and requires Node.js 18 or later.

## What the skill provides

- Stack-agnostic principles for maintainable, secure projects without unnecessary complexity.
- A workflow for understanding an existing codebase, planning non-trivial work, implementing, validating, and reporting changes.
- Permission guidance for database and production operations, destructive changes, and secrets.
- A scaffold checklist for project documentation and `AGENTS.md`.
- A Node.js/TypeScript backend profile with Neon PostgreSQL, Drizzle, Vitest, local PostgreSQL for database tests, mocked external APIs, and structured Pino logging.
- An agent-platform architecture reference.

The skill follows existing project conventions rather than replacing an established stack. Its database guidance defaults to Neon PostgreSQL for new choices. It also prohibits creating or changing migration files and running migration commands.

## Install

Install for all projects (default target: `$CLAUDE_CONFIG_DIR/skills` or `~/.claude/skills`):

```bash
npx project-setup-skill
```

Install for the current project only:

```bash
npx project-setup-skill --project
```

Install into a custom skills directory:

```bash
npx project-setup-skill --dir <path>
```

Preview an install without changing files:

```bash
npx project-setup-skill --dry-run
```

The installer creates a `project-setup` directory containing the skill. It will not overwrite a directory it did not install unless `--force` is provided. Use `--force` carefully, as it replaces that directory.

## Update or uninstall

Run the install command again to update an installation. Use the same target options (`--project` or `--dir`) to select where it is installed.

Uninstall from the default target:

```bash
npx project-setup-skill uninstall
```

For a project or custom target, pass the matching option:

```bash
npx project-setup-skill uninstall --project
npx project-setup-skill uninstall --dir <path>
```

The installer only removes a directory it previously created unless `--force` is specified. To see all options:

```bash
npx project-setup-skill --help
```

Restart an agent session that was already running when you install or update the skill.

## Package contents

```text
skill/project-setup/
  SKILL.md
  assets/AGENTS.md.template
  references/
    agent-architecture.md
    stacks/
      node-backend.md
```

To add another stack profile, create a file under `skill/project-setup/references/stacks/` and link it from section 2 of `SKILL.md`.

## License

MIT. See [LICENSE](./LICENSE).
