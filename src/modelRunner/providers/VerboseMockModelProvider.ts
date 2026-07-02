import { ConfigurableMockModelProvider } from "./ConfigurableMockModelProvider";

export class VerboseMockModelProvider extends ConfigurableMockModelProvider {
  constructor() {
    super({
      name: "verbose-mock",
      responseForUserMessage: (content) =>
        `This is a more detailed mock response for: ${content}`,
      responseWithoutUserMessage: "This is a more detailed mock response.",
      metadata: (request) => ({
        mocked: true,
        style: "verbose",
        input: request,
      }),
    });
  }
}
