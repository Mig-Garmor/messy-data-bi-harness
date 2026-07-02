import { randomUUID } from "node:crypto";
import { relative } from "node:path";

import { loadConfig } from "./config/loadConfig";
import { compareModels, saveModelComparison } from "./modelRunner/compareModels";
import { createRun } from "./tracing/createRun";
import { writeTrace } from "./tracing/writeTrace";
import { getTask, listTasks } from "./tasks/registry";
import { runTask } from "./tasks/runTask";

async function main(): Promise<void> {
  const config = loadConfig();
  const command = process.argv[2] ?? "task";

  if (command === "list-tasks") {
    for (const task of listTasks()) {
      console.log(`${task.id}\t${task.description}`);
    }
    return;
  }

  if (command === "task") {
    const { taskId, promptPath } = parseTaskArgs(process.argv.slice(3));
    const task = getTask(taskId);
    const run = createRun();
    const result = await runTask(task, {
      runId: run.id,
      promptPath,
    });

    const tracePath = await writeTrace(config.runsDir, {
      traceId: randomUUID(),
      runId: run.id,
      taskName: result.taskName,
      promptVersion: result.prompt.version,
      provider: result.modelResult.provider,
      model: result.modelResult.model,
      input: result.input,
      prompt: result.prompt.content,
      rawOutput: result.rawOutput,
      parsedOutput: result.parsedOutput,
      usage: getTraceUsage(result.modelResult.usage),
      durationMs: result.timing.durationMs,
      createdAt: run.createdAt,
    });

    console.log(JSON.stringify({ runId: run.id, tracePath, passed: result.passed }, null, 2));
    return;
  }

  if (command === "compare-models") {
    const { taskId, promptPath } = parseTaskArgs(process.argv.slice(3));
    const task = getTask(taskId);
    const run = createRun();
    const results = await compareModels({
      task,
      context: {
        runId: run.id,
        promptPath,
      },
      modelAssignments: config.comparisonModelAssignments,
    });
    const comparisonPath = await saveModelComparison({
      modelComparisonsDir: config.modelComparisonsDir,
      taskName: task.id,
      results,
    });

    console.log(relative(process.cwd(), comparisonPath));
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

interface TaskCliArgs {
  taskId: string;
  promptPath?: string;
}

interface ModelUsage {
  inputTokens: number;
  outputTokens: number;
}

function getTraceUsage(usage: ModelUsage | undefined): TraceUsage | undefined {
  if (!usage) {
    return undefined;
  }

  return {
    inputTokens: usage.inputTokens,
    outputTokens: usage.outputTokens,
    totalTokens: usage.inputTokens + usage.outputTokens,
  };
}

interface TraceUsage {
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
}

function parseTaskArgs(args: string[]): TaskCliArgs {
  let taskId = "smoke-test";
  let promptPath: string | undefined;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--prompt") {
      const value = args[index + 1];

      if (!value || value.startsWith("--")) {
        throw new Error("Missing value for --prompt");
      }

      promptPath = value;
      index += 1;
      continue;
    }

    if (arg.startsWith("--")) {
      throw new Error(`Unknown option: ${arg}`);
    }

    taskId = arg;
  }

  return { taskId, promptPath };
}
