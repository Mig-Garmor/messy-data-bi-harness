import type { ModelAssignment } from "../modelRunner/types";

const taskModelAssignments: Record<string, ModelAssignment> = {
  "smoke-test": {
    model: "openai/gpt-oss-20b",
    provider: "openrouter",
  },
};

const comparisonModelAssignments: ModelAssignment[] = [
  {
    model: "mock-model",
    provider: "mock",
  },
  {
    model: "openai/gpt-oss-20b",
    provider: "openrouter",
  },
];

export const appConfig = {
  defaultTaskModelAssignment: {
    model: "mock-model",
    provider: "mock",
  },
  taskModelAssignments,
  comparisonModelAssignments,
  storage: {
    modelComparisonsDir: "storage/model-comparisons",
    runsDir: "storage/runs",
  },
} as const;

export function getTaskModelAssignment(taskId: string): ModelAssignment {
  return (
    appConfig.taskModelAssignments[taskId] ??
    appConfig.defaultTaskModelAssignment
  );
}
