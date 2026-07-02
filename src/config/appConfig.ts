import type { ModelAssignment } from "../modelRunner/types";

const taskModelAssignments: Record<string, ModelAssignment> = {
  "smoke-test": {
    model: "mock-model",
    provider: "mock",
  },
};

const comparisonModelAssignments: ModelAssignment[] = [
  {
    model: "mock-model",
    provider: "mock",
  },
  {
    model: "mock-model",
    provider: "verbose-mock",
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
  return appConfig.taskModelAssignments[taskId] ?? appConfig.defaultTaskModelAssignment;
}
