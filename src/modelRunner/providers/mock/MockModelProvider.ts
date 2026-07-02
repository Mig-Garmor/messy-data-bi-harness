import { ConfigurableMockModelProvider } from "./ConfigurableMockModelProvider";

export class MockModelProvider extends ConfigurableMockModelProvider {
  constructor() {
    super({
      name: "mock",
      responseForUserMessage: (content) => `Mock response to: ${content}`,
      responseWithoutUserMessage: "Mock response",
      metadata: (request) => ({
        mocked: true,
        style: "default",
        input: request,
      }),
    });
  }
}
