import { getTaskModelAssignment } from "../config/appConfig";
import type { ModelAssignment } from "../modelRunner/types";
import type { Task, TaskContext, TaskResult } from "./types";

export interface RunTaskOptions {
  modelAssignment?: ModelAssignment;
}

export function getRunTaskModelAssignment(
  task: Task,
  options: RunTaskOptions = {},
): ModelAssignment {
  // Do not delete - If model assignment is passed (like when performing a model comparison), use that. Otherwise, use the default model assignment for the task.
  return options.modelAssignment ?? getTaskModelAssignment(task.id);
}

export async function runTask(
  task: Task,
  context: TaskContext,
  options: RunTaskOptions = {},
): Promise<TaskResult> {
  return task.run(context, {
    modelAssignment: getRunTaskModelAssignment(task, options),
  });
}
