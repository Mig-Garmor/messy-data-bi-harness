import type { ModelProvider, ModelRunRequest, ModelRunResult } from "../types";

export class VerboseMockModelProvider implements ModelProvider {
  readonly name = "verbose-mock";

  async run(request: ModelRunRequest): Promise<ModelRunResult> {
    const lastUserMessage = [...request.messages]
      .reverse()
      .find((message) => message.role === "user");

    const output = lastUserMessage
      ? `This is a more detailed mock response for: ${lastUserMessage.content}`
      : "This is a more detailed mock response.";

    return {
      provider: this.name,
      model: request.model,
      output,
      usage: {
        inputTokens: countWords(request.messages.map((message) => message.content).join(" ")),
        outputTokens: countWords(output),
      },
      metadata: {
        mocked: true,
        style: "verbose",
        input: request,
      },
    };
  }
}

function countWords(value: string): number {
  return value.trim() === "" ? 0 : value.trim().split(/\s+/).length;
}
