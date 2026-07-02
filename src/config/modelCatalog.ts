import type { ModelAssignment } from "../modelRunner/types";

export const modelCatalog = {
  mockDefault: {
    model: "mock-model",
    provider: "mock",
  },
  mockVerbose: {
    model: "mock-model",
    provider: "verbose-mock",
  },
  //20b
  openRouterOpenAiGptOss20bFree: {
    model: "openai/gpt-oss-20b:free",
    provider: "openrouter",
  },
  //30b
  openRouterNvidiaNemotron3Nano30bA3bFree: {
    model: "nvidia/nemotron-3-nano-30b-a3b:free",
    provider: "openrouter",
  },
  //12b
  openRouterNvidiaNemotronNano12bV2VlFree: {
    model: "nvidia/nemotron-nano-12b-v2-vl:free",
    provider: "openrouter",
  },
  //9b
  openRouterNvidiaNemotronNano9bV2Free: {
    model: "nvidia/nemotron-nano-9b-v2:free",
    provider: "openrouter",
  },
  // Models below are not working through open router
  openRouterOpenAiGptOss120bFree: {
    model: "openai/gpt-oss-120b:free",
    provider: "openrouter",
  },
  openRouterQwen3Next80bA3bInstructFree: {
    model: "qwen/qwen3-next-80b-a3b-instruct:free",
    provider: "openrouter",
  },
} satisfies Record<string, ModelAssignment>;
