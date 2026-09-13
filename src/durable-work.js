export class DurableWorkStore {
  constructor() {
    this.tasks = new Map();
  }

  start(task) {
    if (!task?.taskId) throw new Error("TASK_ID_REQUIRED");
    if (this.tasks.has(task.taskId)) throw new Error("TASK_ALREADY_EXISTS");
    const value = { ...structuredClone(task), status: "ACTIVE" };
    this.tasks.set(task.taskId, value);
    return structuredClone(value);
  }

  get(taskId) {
    const task = this.tasks.get(taskId);
    return task ? structuredClone(task) : null;
  }

  checkpoint(taskId, checkpoint) {
    const task = this.tasks.get(taskId);
    if (!task) throw new Error("TASK_NOT_FOUND");
    if (task.status !== "ACTIVE") throw new Error("TASK_NOT_ACTIVE");
    task.checkpoint = structuredClone(checkpoint);
    return structuredClone(task);
  }

  complete(taskId) {
    const task = this.tasks.get(taskId);
    if (!task) throw new Error("TASK_NOT_FOUND");
    task.status = "COMPLETED";
    return structuredClone(task);
  }

  cancel(taskId, reason = "cancelled") {
    const task = this.tasks.get(taskId);
    if (!task) throw new Error("TASK_NOT_FOUND");
    task.status = "CANCELLED";
    task.cancelReason = reason;
    return structuredClone(task);
  }
}
