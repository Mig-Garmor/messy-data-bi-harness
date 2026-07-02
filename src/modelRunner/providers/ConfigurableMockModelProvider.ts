import type { ModelProvider, ModelRunRequest, ModelRunResult } from "../types";

interface ConfigurableMockModelProviderOptions {
  name: string;
  responseForUserMessage: (content: string) => string;
  responseWithoutUserMessage: string;
  metadata?: (request: ModelRunRequest) => Record<string, unknown>;
}

export class ConfigurableMockModelProvider implements ModelProvider {
  readonly name: string;

  private readonly responseForUserMessage: (content: string) => string;
  private readonly responseWithoutUserMessage: string;
  private readonly metadata?: (request: ModelRunRequest) => Record<string, unknown>;

  constructor(options: ConfigurableMockModelProviderOptions) {
    this.name = options.name;
    this.responseForUserMessage = options.responseForUserMessage;
    this.responseWithoutUserMessage = options.responseWithoutUserMessage;
    this.metadata = options.metadata;
  }

  async run(request: ModelRunRequest): Promise<ModelRunResult> {
    const output = this.createOutput(request);
    const result: ModelRunResult = {
      provider: this.name,
      model: request.model,
      output,
      usage: {
        inputTokens: countWords(request.messages.map((message) => message.content).join(" ")),
        outputTokens: countWords(output),
      },
    };

    if (this.metadata) {
      result.metadata = this.metadata(request);
    }

    return result;
  }

  private createOutput(request: ModelRunRequest): string {
    const lastUserMessage = [...request.messages]
      .reverse()
      .find((message) => message.role === "user");

    return lastUserMessage
      ? this.responseForUserMessage(lastUserMessage.content)
      : this.responseWithoutUserMessage;
  }
}

function countWords(value: string): number {
  return value.trim() === "" ? 0 : value.trim().split(/\s+/).length;
}
