import type { ModelProvider, ModelRunRequest, ModelRunResult } from "../types";

export class MockModelProvider implements ModelProvider {
  readonly name = "mock";

  async run(request: ModelRunRequest): Promise<ModelRunResult> {
    const lastUserMessage = [...request.messages]
      .reverse()
      .find((message) => message.role === "user");

    const output = lastUserMessage
      ? `Mock response to: ${lastUserMessage.content}`
      : "Mock response";

    return {
      provider: this.name,
      model: request.model,
      output,
      usage: {
        inputTokens: countWords(request.messages.map((message) => message.content).join(" ")),
        outputTokens: countWords(output),
      },
    };
  }
}

function countWords(value: string): number {
  return value.trim() === "" ? 0 : value.trim().split(/\s+/).length;
}
