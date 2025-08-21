import { AppBlock, events } from "@slflows/sdk/v1";
import {
  LambdaClient,
  GetAccountSettingsCommand,
} from "@aws-sdk/client-lambda";

const getAccountSettings: AppBlock = {
  name: "Get Account Settings",
  description:
    "Retrieves details about your account's limits and usage in an Amazon Web Services Region.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new LambdaClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new GetAccountSettingsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Account Settings Result",
      description: "Result from GetAccountSettings operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          AccountLimit: {
            type: "object",
            properties: {
              TotalCodeSize: {
                type: "number",
              },
              CodeSizeUnzipped: {
                type: "number",
              },
              CodeSizeZipped: {
                type: "number",
              },
              ConcurrentExecutions: {
                type: "number",
              },
              UnreservedConcurrentExecutions: {
                type: "number",
              },
            },
            additionalProperties: false,
            description:
              "Limits that are related to concurrency and code storage.",
          },
          AccountUsage: {
            type: "object",
            properties: {
              TotalCodeSize: {
                type: "number",
              },
              FunctionCount: {
                type: "number",
              },
            },
            additionalProperties: false,
            description:
              "The number of functions and amount of storage in use.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getAccountSettings;
