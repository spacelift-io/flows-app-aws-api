import { AppBlock, events } from "@slflows/sdk/v1";
import {
  Route53Client,
  GetAccountLimitCommand,
} from "@aws-sdk/client-route-53";

const getAccountLimit: AppBlock = {
  name: "Get Account Limit",
  description:
    "Gets the specified limit for the current account, for example, the maximum number of health checks that you can create using the account.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Type: {
          name: "Type",
          description: "The limit that you want to get.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new Route53Client({
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

        const command = new GetAccountLimitCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Account Limit Result",
      description: "Result from GetAccountLimit operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Limit: {
            type: "object",
            properties: {
              Type: {
                type: "string",
              },
              Value: {
                type: "number",
              },
            },
            required: ["Type", "Value"],
            additionalProperties: false,
            description: "The current setting for the specified limit.",
          },
          Count: {
            type: "number",
            description:
              "The current number of entities that you have created of the specified type.",
          },
        },
        required: ["Limit", "Count"],
      },
    },
  },
};

export default getAccountLimit;
