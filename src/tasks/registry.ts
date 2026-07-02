import { smokeTestTask } from "./smokeTestTask";
import type { Task } from "./types";

const taskRegistry = new Map<string, Task>([[smokeTestTask.id, smokeTestTask]]);

export function getTask(taskId: string): Task {
  const task = taskRegistry.get(taskId);

  if (!task) {
    throw new Error(`Unknown task: ${taskId}`);
  }

  return task;
}

export function listTasks(): Task[] {
  return [...taskRegistry.values()];
}
