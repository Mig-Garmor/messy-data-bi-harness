import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { runModel } from "../modelRunner/runModel";
import type { Task, TaskContext, TaskResult } from "./types";

export const smokeTestTask: Task = {
  id: "smoke-test",
  description: "Checks that the model runner can execute a basic prompt.",
  async run(context: TaskContext): Promise<TaskResult> {
    const prompt = await readFile(join(process.cwd(), "prompts", "smoke-test.v1.md"), "utf8");
    const modelResult = await runModel(
      {
        model: context.model,
        messages: [{ role: "user", content: prompt }],
      },
      context.provider,
    );

    return {
      taskId: smokeTestTask.id,
      modelResult,
      passed: modelResult.output.trim().length > 0,
    };
  },
};
