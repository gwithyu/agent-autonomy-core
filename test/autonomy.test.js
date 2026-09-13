import test from "node:test";
import assert from "node:assert/strict";
import { AutonomyCore } from "../src/index.js";

test("silence closes an opportunity", () => {
  const core = new AutonomyCore();
  const item = core.createOpportunity({ reason: "idle" });
  const result = core.markSilence({ opportunityId: item.id });
  assert.equal(result.status, "CLOSED");
  assert.equal(result.outcome, "SILENT");
});
