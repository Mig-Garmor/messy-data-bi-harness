import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { runTask } from "../tasks/runTask";
import type { Task, TaskContext } from "../tasks/types";
import type { ModelAssignment } from "./types";

export interface ModelComparisonResult {
  provider: string;
  model: string;
  rawText: unknown;
  parsed: unknown;
  usage?: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };
  durationMs: number;
}

export async function compareModels(options: {
  task: Task;
  context: TaskContext;
  modelAssignments: ModelAssignment[];
}): Promise<ModelComparisonResult[]> {
  const results: ModelComparisonResult[] = [];

  for (const modelAssignment of options.modelAssignments) {
    const result = await runTask(options.task, options.context, { modelAssignment });

    results.push({
      provider: result.modelResult.provider,
      model: result.modelResult.model,
      rawText: result.rawOutput,
      parsed: result.parsedOutput,
      usage: result.modelResult.usage
        ? {
            inputTokens: result.modelResult.usage.inputTokens,
            outputTokens: result.modelResult.usage.outputTokens,
            totalTokens:
              result.modelResult.usage.inputTokens + result.modelResult.usage.outputTokens,
          }
        : undefined,
      durationMs: result.timing.durationMs,
    });
  }

  return results;
}

export async function saveModelComparison(options: {
  modelComparisonsDir: string;
  taskName: string;
  results: unknown;
}): Promise<string> {
  const dir = join(process.cwd(), options.modelComparisonsDir, options.taskName);
  await mkdir(dir, { recursive: true });

  const comparisonPath = join(dir, "comparison.json");
  await writeFile(comparisonPath, `${JSON.stringify(options.results, null, 2)}\n`, "utf8");

  return comparisonPath;
}
