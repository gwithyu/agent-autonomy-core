function copy(value) {
  return value == null ? value : structuredClone(value);
}

export class DurableWorkStore {
  constructor() {
    this.tasks = new Map();
  }

  start({ taskId, correlationId = null, opportunityId = null, checkpoint = null, metadata = null }) {
    if (!taskId) throw new Error("TASK_ID_REQUIRED");
    if (this.tasks.has(taskId)) throw new Error("TASK_ALREADY_EXISTS");

    const value = {
      taskId,
      correlationId,
      opportunityId,
      checkpoint: copy(checkpoint),
      metadata: copy(metadata),
      status: "ACTIVE",
    };

    this.tasks.set(taskId, value);
    return copy(value);
  }

  get(taskId) {
    const task = this.tasks.get(taskId);
    return task ? copy(task) : null;
  }

  list({ status } = {}) {
    return [...this.tasks.values()]
      .filter((task) => !status || task.status === status)
      .map(copy);
  }

  checkpoint({ taskId, checkpoint }) {
    const task = this.#active(taskId);
    task.checkpoint = copy(checkpoint);
    return copy(task);
  }

  resume({ taskId }) {
    return copy(this.#active(taskId));
  }

  complete({ taskId }) {
    const task = this.#active(taskId);
    task.status = "COMPLETED";
    return copy(task);
  }

  cancel({ taskId, reason = "cancelled" }) {
    const task = this.#active(taskId);
    task.status = "CANCELLED";
    task.cancelReason = reason;
    return copy(task);
  }

  #active(taskId) {
    const task = this.tasks.get(taskId);
    if (!task) throw new Error("TASK_NOT_FOUND");
    if (task.status !== "ACTIVE") throw new Error("TASK_NOT_ACTIVE");
    return task;
  }
}
