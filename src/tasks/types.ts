import type { ModelRunResult } from "../modelRunner/types";

export interface TaskContext {
  runId: string;
  model: string;
  provider: string;
}

export interface TaskResult {
  taskId: string;
  modelResult: ModelRunResult;
  passed: boolean;
  notes?: string[];
}

export interface Task {
  id: string;
  description: string;
  run(context: TaskContext): Promise<TaskResult>;
}
