import { AppBlock, events } from "@slflows/sdk/v1";
import {
  Route53Client,
  GetHostedZoneLimitCommand,
} from "@aws-sdk/client-route-53";

const getHostedZoneLimit: AppBlock = {
  name: "Get Hosted Zone Limit",
  description:
    "Gets the specified limit for a specified hosted zone, for example, the maximum number of records that you can create in the hosted zone.",
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
        HostedZoneId: {
          name: "Hosted Zone Id",
          description:
            "The ID of the hosted zone that you want to get a limit for.",
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

        const command = new GetHostedZoneLimitCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Hosted Zone Limit Result",
      description: "Result from GetHostedZoneLimit operation",
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

export default getHostedZoneLimit;
