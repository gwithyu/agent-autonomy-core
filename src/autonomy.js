import { randomUUID } from "node:crypto";

export class AutonomyCore {
  constructor({ now = () => new Date() } = {}) {
    this.now = now;
    this.opportunities = new Map();
  }

  createOpportunity({ reason = "unspecified", correlationId = randomUUID() } = {}) {
    const id = randomUUID();
    const createdAt = this.now().toISOString();
    const opportunity = {
      id,
      correlationId,
      reason,
      status: "OPEN",
      createdAt,
      completedAt: null,
      outcome: null,
    };
    this.opportunities.set(id, opportunity);
    return structuredClone(opportunity);
  }

  getOpportunity(opportunityId) {
    const item = this.opportunities.get(opportunityId);
    return item ? structuredClone(item) : null;
  }

  markSilence({ opportunityId }) {
    return this.#finish(opportunityId, "SILENT");
  }

  complete({ opportunityId, outcome = "COMPLETED" }) {
    return this.#finish(opportunityId, outcome);
  }

  #finish(opportunityId, outcome) {
    const item = this.opportunities.get(opportunityId);
    if (!item) throw new Error("OPPORTUNITY_NOT_FOUND");
    if (item.status !== "OPEN") throw new Error("OPPORTUNITY_ALREADY_CLOSED");
    item.status = "CLOSED";
    item.outcome = outcome;
    item.completedAt = this.now().toISOString();
    return structuredClone(item);
  }
}
