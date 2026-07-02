import { loadConfig } from "./config/loadConfig";
import { createRun } from "./tracing/createRun";
import { writeTrace } from "./tracing/writeTrace";
import { getTask, listTasks } from "./tasks/registry";

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
    const taskId = process.argv[3] ?? "smoke-test";
    const task = getTask(taskId);
    const run = createRun();
    const result = await task.run({
      runId: run.id,
      model: config.defaultModel,
      provider: config.defaultProvider,
    });

    const tracePath = await writeTrace(config.runsDir, {
      runId: run.id,
      createdAt: run.createdAt,
      taskId: result.taskId,
      passed: result.passed,
      data: result,
    });

    console.log(JSON.stringify({ runId: run.id, tracePath, passed: result.passed }, null, 2));
    return;
  }

  if (command === "compare-models") {
    throw new Error("compare-models is not implemented yet.");
  }

  throw new Error(`Unknown command: ${command}`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
