import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { basename, isAbsolute, join, relative, resolve } from "node:path";

import { runModel } from "../modelRunner/runModel";
import type { ModelMessage } from "../modelRunner/types";
import type { ParsedOutputTrace, PromptTrace, Task, TaskContext, TaskResult } from "./types";

const defaultPromptPath = "prompts/smoke-test.v1.md";

export const smokeTestTask: Task = {
  id: "smoke-test",
  description: "Checks that the model runner can execute a basic prompt.",
  async run(context: TaskContext): Promise<TaskResult> {
    const startedAtMs = Date.now();
    const startedAt = new Date(startedAtMs).toISOString();
    const prompt = await loadPrompt(context.promptPath ?? defaultPromptPath);
    const input: { messages: ModelMessage[] } = {
      messages: [{ role: "user", content: prompt.content }],
    };
    const modelResult = await runModel(
      {
        model: context.model,
        messages: input.messages,
      },
      context.provider,
    );
    const parsedOutput = parseSmokeTestOutput(modelResult.output);
    const completedAtMs = Date.now();

    return {
      taskId: smokeTestTask.id,
      taskName: smokeTestTask.id,
      prompt,
      input,
      rawOutput: modelResult.output,
      modelResult,
      parsedOutput,
      timing: {
        startedAt,
        completedAt: new Date(completedAtMs).toISOString(),
        durationMs: completedAtMs - startedAtMs,
      },
      passed: parsedOutput.isNonEmpty,
    };
  },
};

async function loadPrompt(promptPath: string): Promise<PromptTrace> {
  const absolutePath = isAbsolute(promptPath) ? promptPath : join(process.cwd(), promptPath);
  const content = await readFile(absolutePath, "utf8");

  return {
    path: relative(process.cwd(), resolve(absolutePath)),
    version: getPromptVersion(absolutePath),
    sha256: createHash("sha256").update(content).digest("hex"),
    content,
  };
}

function getPromptVersion(promptPath: string): string {
  const promptFileName = basename(promptPath);
  const versionMatch = promptFileName.match(/(?:^|\.)(v\d+(?:\.\d+)*)(?:\.|$)/);

  return versionMatch?.[1] ?? "unknown";
}

function parseSmokeTestOutput(output: string): ParsedOutputTrace {
  const normalizedOutput = output.trim().replace(/\s+/g, " ");
  const sentences =
    normalizedOutput === ""
      ? []
      : normalizedOutput
          .split(/(?<=[.!?])\s+/)
          .map((sentence) => sentence.trim())
          .filter(Boolean);

  return {
    normalizedOutput,
    sentences,
    wordCount: normalizedOutput === "" ? 0 : normalizedOutput.split(/\s+/).length,
    isNonEmpty: normalizedOutput.length > 0,
  };
}
