import { MockModelProvider } from "./mock/MockModelProvider";
import { VerboseMockModelProvider } from "./mock/VerboseMockModelProvider";
import type { ModelProvider } from "../types";

export const modelProviders: ModelProvider[] = [
  new MockModelProvider(),
  new VerboseMockModelProvider(),
];
