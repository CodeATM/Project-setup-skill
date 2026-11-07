# Agent architecture

Don't let OpenCode (or any coding model) become the agent. The orchestrator is yours.

| Component | Owns |
|---|---|
| Orchestrator | Planning, memory, context, permissions, tools, scheduling, workflows, decisions |
| Coding agent (OpenCode etc.) | Code changes only. Replaceable behind an interface |
| Neon PostgreSQL | Durable application state (tasks, memory, audit, usage) |
| Redis/BullMQ | Execution, background processing, retries |
| Tool registry | The definitive list of what the agent can do. No tool, no capability |
| Approval system | Gate for sensitive operations (same three levels: Read / Execute / Approval required) |
| Audit system | Records what the agent did and why |

## Requirements
- **Durable task execution**: tasks survive restarts; state lives in Postgres, not memory or chat history.
- **Bounded context**: cap and curate what goes into each model call.
- **Token and cost tracking**: per task, per model, queryable.
- **Persistent memory**: stored and retrieved deliberately, not dependent on conversation history.
- **Swappable executors**: coding agent invoked through a narrow interface so it can be replaced without touching orchestration.
- Every tool call: permission check → (approval if required) → execute → audit log entry.

## Anti-patterns
- Letting the coding agent decide its own permissions.
- Storing task state only in the model's context.
- Adding a framework (LangChain etc.) for orchestration you can write in a few hundred lines. Justify any agent framework explicitly.
