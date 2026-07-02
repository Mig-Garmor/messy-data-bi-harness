import type { ModelAssignment, ModelRunResult } from "../modelRunner/types";

export interface TaskContext {
  runId: string;
  promptPath?: string;
}

// Used for tasks that need to be run with a specific model assignment, such as comparison tasks.
export interface TaskRunOptions {
  modelAssignment?: ModelAssignment;
}

export interface PromptTrace {
  path: string;
  version: string;
  sha256: string;
  content: string;
}

export interface ParsedOutputTrace {
  normalizedOutput: string;
  sentences: string[];
  wordCount: number;
  isNonEmpty: boolean;
}

export interface TaskTiming {
  startedAt: string;
  completedAt: string;
  durationMs: number;
}

export interface TaskResult {
  taskId: string;
  taskName: string;
  prompt: PromptTrace;
  input: unknown;
  rawOutput?: unknown;
  modelResult: ModelRunResult;
  parsedOutput: ParsedOutputTrace;
  timing: TaskTiming;
  passed: boolean;
  notes?: string[];
}

export interface Task {
  id: string;
  description: string;
  run(context: TaskContext, options?: TaskRunOptions): Promise<TaskResult>;
}
