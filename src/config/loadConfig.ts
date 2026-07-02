export interface AppConfig {
  defaultModel: string;
  defaultProvider: string;
  comparisonProviderOne: string;
  comparisonProviderTwo: string;
  modelComparisonsDir: string;
  runsDir: string;
}

export function loadConfig(): AppConfig {
  return {
    defaultModel: process.env.MODEL ?? "mock-model",
    defaultProvider: process.env.MODEL_PROVIDER ?? "mock",
    comparisonProviderOne: process.env.MODEL_COMPARISON_PROVIDER_ONE ?? "mock",
    comparisonProviderTwo: process.env.MODEL_COMPARISON_PROVIDER_TWO ?? "verbose-mock",
    modelComparisonsDir: process.env.MODEL_COMPARISONS_DIR ?? "storage/model-comparisons",
    runsDir: process.env.RUNS_DIR ?? "storage/runs",
  };
}
