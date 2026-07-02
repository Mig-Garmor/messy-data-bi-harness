import type { ModelAssignment } from "../modelRunner/types";
import { modelCatalog } from "./modelCatalog";

const taskModelAssignments: Record<string, ModelAssignment> = {
  "smoke-test": modelCatalog.openRouterNvidiaNemotronNano9bV2Free,
};

const comparisonModelAssignments: ModelAssignment[] = [
  modelCatalog.mockDefault,
  modelCatalog.openRouterOpenAiGptOss20bFree,
];

export const appConfig = {
  defaultTaskModelAssignment: modelCatalog.mockDefault,
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
