import type { ModelMessage, ModelProvider, ModelRunRequest, ModelRunResult } from "../../types";

const openRouterApiUrl = "https://openrouter.ai/api/v1/chat/completions";

interface OpenRouterChatCompletionResponse {
  id?: string;
  model?: string;
  choices?: Array<{
    message?: {
      content?: unknown;
      role?: string;
    };
    finish_reason?: string | null;
  }>;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
  openrouter_metadata?: unknown;
}

interface OpenRouterErrorResponse {
  error?: {
    message?: string;
    code?: string | number;
  };
}

export class OpenRouterModelProvider implements ModelProvider {
  readonly name = "openrouter";

  async run(request: ModelRunRequest): Promise<ModelRunResult> {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      throw new Error("OPENROUTER_API_KEY is required to use the openrouter provider.");
    }

    const response = await fetch(openRouterApiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "X-OpenRouter-Metadata": "enabled",
      },
      body: JSON.stringify({
        model: request.model,
        messages: toOpenRouterMessages(request.messages),
        max_tokens: 512,
        temperature: request.temperature,
      }),
    });

    const responseBody = parseOpenRouterResponse(await response.text());

    if (!response.ok) {
      const message = responseBody.error?.message ?? response.statusText;
      throw new Error(`OpenRouter request failed (${response.status}): ${message}`);
    }

    const output = getAssistantOutput(responseBody);

    return {
      provider: this.name,
      model: responseBody.model ?? request.model,
      output,
      usage: getUsage(responseBody),
      metadata: {
        id: responseBody.id,
        finishReason: responseBody.choices?.[0]?.finish_reason,
        openrouter: responseBody.openrouter_metadata,
      },
    };
  }
}

function parseOpenRouterResponse(
  responseText: string,
): OpenRouterChatCompletionResponse & OpenRouterErrorResponse {
  try {
    return JSON.parse(responseText) as OpenRouterChatCompletionResponse & OpenRouterErrorResponse;
  } catch {
    return {
      error: {
        message: responseText,
      },
    };
  }
}

function toOpenRouterMessages(messages: ModelMessage[]): ModelMessage[] {
  return messages.map((message) => ({
    role: message.role,
    content: message.content,
  }));
}

function getAssistantOutput(response: OpenRouterChatCompletionResponse): string {
  const content = response.choices?.[0]?.message?.content;

  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "string") {
          return part;
        }

        if (
          part &&
          typeof part === "object" &&
          "text" in part &&
          typeof part.text === "string"
        ) {
          return part.text;
        }

        return "";
      })
      .join("");
  }

  return "";
}

function getUsage(response: OpenRouterChatCompletionResponse): ModelRunResult["usage"] {
  const promptTokens = response.usage?.prompt_tokens;
  const completionTokens = response.usage?.completion_tokens;

  if (typeof promptTokens !== "number" || typeof completionTokens !== "number") {
    return undefined;
  }

  return {
    inputTokens: promptTokens,
    outputTokens: completionTokens,
  };
}
