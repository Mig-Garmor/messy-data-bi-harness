import type { ModelAssignment } from "../modelRunner/types";
import { appConfig } from "./appConfig";

export interface AppConfig {
  comparisonModelAssignments: ModelAssignment[];
  modelComparisonsDir: string;
  runsDir: string;
}

export function loadConfig(): AppConfig {
  return {
    comparisonModelAssignments: appConfig.comparisonModelAssignments,
    modelComparisonsDir:
      process.env.MODEL_COMPARISONS_DIR ?? appConfig.storage.modelComparisonsDir,
    runsDir: process.env.RUNS_DIR ?? appConfig.storage.runsDir,
  };
}
