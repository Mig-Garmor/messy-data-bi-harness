import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import type { Task, TaskContext } from "../tasks/types";

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
  context: Omit<TaskContext, "provider">;
  providerNames: string[];
}): Promise<ModelComparisonResult[]> {
  const results: ModelComparisonResult[] = [];

  for (const providerName of options.providerNames) {
    const result = await options.task.run({
      ...options.context,
      provider: providerName,
    });

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
