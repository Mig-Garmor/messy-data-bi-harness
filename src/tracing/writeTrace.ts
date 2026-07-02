import { join } from "node:path";

import { ensureDir, writeJsonFile } from "../utils/fs";

export interface TraceRecord {
  runId: string;
  createdAt: string;
  taskId: string;
  passed: boolean;
  data: unknown;
}

export async function writeTrace(runsDir: string, record: TraceRecord): Promise<string> {
  const runDir = join(process.cwd(), runsDir, record.runId);
  await ensureDir(runDir);

  const tracePath = join(runDir, `${record.taskId}.json`);
  await writeJsonFile(tracePath, record);

  return tracePath;
}
