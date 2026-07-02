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
  private readonly metadata?: (
    request: ModelRunRequest,
  ) => Record<string, unknown>;

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
        inputTokens: countWords(
          request.messages.map((message) => message.content).join(" "),
        ),
        outputTokens: countWords(output),
      },
    };

    if (this.metadata) {
      result.metadata = this.metadata(request);
    }

    return result;
  }

  private createOutput(request: ModelRunRequest): string {
    const lastUserMessage = this.getLastUserMessage(request);

    return lastUserMessage
      ? this.responseForUserMessage(lastUserMessage.content)
      : this.responseWithoutUserMessage;
  }

  private getLastUserMessage(
    request: ModelRunRequest,
  ): ModelRunRequest["messages"][number] | undefined {
    for (let i = request.messages.length - 1; i >= 0; i--) {
      const message = request.messages[i];

      if (message?.role === "user") {
        return message;
      }
    }

    return undefined;
  }
}

function countWords(value: string): number {
  const trimmedValue = value.trim();

  return trimmedValue === "" ? 0 : trimmedValue.split(/\s+/).length;
}
