import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EventBridgeClient,
  ListEventBusesCommand,
} from "@aws-sdk/client-eventbridge";

const listEventBuses: AppBlock = {
  name: "List Event Buses",
  description:
    "Lists all the event buses in your account, including the default event bus, custom event buses, and partner event buses.",
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
          description:
            "Specifying this limits the results to only those event buses with names that start with the specified prefix.",
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
            "Specifying this limits the number of results returned by this operation.",
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
        });

        const command = new ListEventBusesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Event Buses Result",
      description: "Result from ListEventBuses operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          EventBuses: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Name: {
                  type: "string",
                },
                Arn: {
                  type: "string",
                },
                Description: {
                  type: "string",
                },
                Policy: {
                  type: "string",
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
            description: "This list of event buses.",
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

export default listEventBuses;
