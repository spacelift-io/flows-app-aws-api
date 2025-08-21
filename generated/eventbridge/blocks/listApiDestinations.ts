import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EventBridgeClient,
  ListApiDestinationsCommand,
} from "@aws-sdk/client-eventbridge";

const listApiDestinations: AppBlock = {
  name: "List Api Destinations",
  description:
    "Retrieves a list of API destination in the account in the current Region.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        NamePrefix: {
          name: "Name Prefix",
          description: "A name prefix to filter results returned.",
          type: "string",
          required: false,
        },
        ConnectionArn: {
          name: "Connection Arn",
          description:
            "The ARN of the connection specified for the API destination.",
          type: "string",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description:
            "The token returned by a previous call, which you can use to retrieve the next set of results.",
          type: "string",
          required: false,
        },
        Limit: {
          name: "Limit",
          description:
            "The maximum number of API destinations to include in the response.",
          type: "number",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new EventBridgeClient({
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

        const command = new ListApiDestinationsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Api Destinations Result",
      description: "Result from ListApiDestinations operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ApiDestinations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ApiDestinationArn: {
                  type: "string",
                },
                Name: {
                  type: "string",
                },
                ApiDestinationState: {
                  type: "string",
                },
                ConnectionArn: {
                  type: "string",
                },
                InvocationEndpoint: {
                  type: "string",
                },
                HttpMethod: {
                  type: "string",
                },
                InvocationRateLimitPerSecond: {
                  type: "number",
                },
                CreationTime: {
                  type: "string",
                },
                LastModifiedTime: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "An array that includes information about each API destination.",
          },
          NextToken: {
            type: "string",
            description: "A token indicating there are more results available.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listApiDestinations;
