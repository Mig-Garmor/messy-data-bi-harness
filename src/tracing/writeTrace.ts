import { join } from "node:path";

import { ensureDir, writeJsonFile } from "../utils/fs";

export type TraceRecord = {
  traceId: string;
  runId: string;
  taskName: string;
  promptVersion: string;
  provider: string;
  model: string;
  input: unknown;
  prompt: string;
  rawOutput?: unknown;
  parsedOutput?: unknown;
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
    totalTokens?: number;
  };
  durationMs: number;
  error?: string;
  createdAt: string;
};

export async function writeTrace(runsDir: string, record: TraceRecord): Promise<string> {
  const runDir = join(process.cwd(), runsDir, record.runId);
  await ensureDir(runDir);

  const tracePath = join(runDir, `${record.traceId}.json`);
  await writeJsonFile(tracePath, record);

  return tracePath;
}
