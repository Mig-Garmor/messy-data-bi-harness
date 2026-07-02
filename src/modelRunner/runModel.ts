import { modelProviders } from "./providers";
import type { ModelProvider, ModelRunRequest, ModelRunResult } from "./types";

const providers: Record<string, ModelProvider> = Object.fromEntries(
  modelProviders.map((provider) => [provider.name, provider]),
);

export async function runModel(
  request: ModelRunRequest,
  providerName = "mock",
): Promise<ModelRunResult> {
  const provider = providers[providerName];

  if (!provider) {
    throw new Error(`Unknown model provider: ${providerName}`);
  }

  return provider.run(request);
}

export function registerModelProvider(provider: ModelProvider): void {
  providers[provider.name] = provider;
}
