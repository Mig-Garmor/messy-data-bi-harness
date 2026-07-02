export interface AppConfig {
  defaultModel: string;
  defaultProvider: string;
  runsDir: string;
}

export function loadConfig(): AppConfig {
  return {
    defaultModel: process.env.MODEL ?? "mock-model",
    defaultProvider: process.env.MODEL_PROVIDER ?? "mock",
    runsDir: process.env.RUNS_DIR ?? "storage/runs",
  };
}
