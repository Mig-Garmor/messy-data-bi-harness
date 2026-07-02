import { MockModelProvider } from "./mock/MockModelProvider";
import { VerboseMockModelProvider } from "./mock/VerboseMockModelProvider";
import { OpenRouterModelProvider } from "./openrouter/OpenRouterModelProvider";
import type { ModelProvider } from "../types";

export const modelProviders: ModelProvider[] = [
  new MockModelProvider(),
  new VerboseMockModelProvider(),
  new OpenRouterModelProvider(),
];
