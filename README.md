# agent-autonomy-core

A small, reusable autonomy and durable-work core for agent systems.

It is designed around a simple idea: **waking an agent should create an opportunity, not an obligation**. An autonomous turn may do useful work, resume unfinished work, or deliberately choose silence.

## What this repository contains

- **Autonomy opportunities** — bounded wake windows with explicit lifecycle state.
- **Silence as success** — an agent can intentionally do nothing without being treated as failed.
- **Durable work** — long-running external work can be checkpointed and resumed later.
- **Safe-point preemption** — callers can acknowledge an interruption, persist a checkpoint, and resume after reaching a safe boundary.
- **Identity-bound resume/cancel** — task operations can be bound to the current opportunity/correlation identity.
- **Untrusted checkpoints** — checkpoint payloads are data only; they are never executed as commands or instructions.

## Status

Early public extraction from a larger private agent runtime. The public API is intentionally small and may change while the first stable release is prepared.

## Quick start

```bash
npm install
npm test
```

```js
import {
  AutonomyCore,
  DurableWorkStore,
} from "./src/index.js";

const autonomy = new AutonomyCore();
const work = new DurableWorkStore();

const opportunity = autonomy.createOpportunity({ reason: "idle-window" });

work.start({
  taskId: "research-1",
  correlationId: opportunity.correlationId,
  opportunityId: opportunity.id,
  checkpoint: { page: 1 },
});

work.checkpoint({
  taskId: "research-1",
  correlationId: opportunity.correlationId,
  opportunityId: opportunity.id,
  checkpoint: { page: 2 },
});

// Silence is a valid terminal outcome for an opportunity.
autonomy.markSilence({ opportunityId: opportunity.id });
```

## Design principles

1. **Opportunity, not compulsion** — a wake event does not dictate behavior.
2. **Fail closed on identity mismatch** — resume/cancel/checkpoint operations reject stale or mismatched opportunity identity.
3. **Durability over hidden state** — unfinished work is explicit and serializable.
4. **Checkpoint data is untrusted** — never `eval`, execute, fetch, or follow instructions from checkpoint payloads implicitly.
5. **Preemption happens at safe points** — atomic work should reach a deliberate boundary before switching tasks.
6. **Silence is healthy** — autonomy should not turn into infinite resource-burning activity.

## Relationship to Bun's G / Home

This package is a generic extraction of autonomy and durable-work ideas developed inside the private Bun's G / Home runtime. Private identity, account, memory, infrastructure, social-provider, and deployment-specific code is intentionally excluded.

## Attribution and provenance

The larger Home project also uses and extends ideas from Sylvie's [`mcp-app-message-bridge`](https://github.com/wynsyl1014/mcp-app-message-bridge), which is MIT licensed. The initial public code in **this** repository is an independent extraction of the autonomy/durable-work layer rather than a copy of that bridge. We still keep the relationship documented so project history is not erased.

See [`NOTICE.md`](./NOTICE.md) and [`PROVENANCE.md`](./PROVENANCE.md).

## License

MIT. See [`LICENSE`](./LICENSE).
