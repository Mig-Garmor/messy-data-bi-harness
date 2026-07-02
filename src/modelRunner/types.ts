export type ModelMessageRole = "system" | "user" | "assistant";

export interface ModelMessage {
  role: ModelMessageRole;
  content: string;
}

export interface ModelRunRequest {
  model: string;
  messages: ModelMessage[];
  temperature?: number;
}

export interface ModelRunResult {
  provider: string;
  model: string;
  output: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
  metadata?: Record<string, unknown>;
}

export interface ModelProvider {
  name: string;
  run(request: ModelRunRequest): Promise<ModelRunResult>;
}
