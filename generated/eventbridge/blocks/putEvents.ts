import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EventBridgeClient,
  PutEventsCommand,
} from "@aws-sdk/client-eventbridge";

const putEvents: AppBlock = {
  name: "Put Events",
  description:
    "Sends custom events to Amazon EventBridge so that they can be matched to rules.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Entries: {
          name: "Entries",
          description: "The entry that defines an event in your system.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Time: {
                  type: "string",
                },
                Source: {
                  type: "string",
                },
                Resources: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                DetailType: {
                  type: "string",
                },
                Detail: {
                  type: "string",
                },
                EventBusName: {
                  type: "string",
                },
                TraceHeader: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
          },
          required: true,
        },
        EndpointId: {
          name: "Endpoint Id",
          description: "The URL subdomain of the endpoint.",
          type: "string",
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

        const command = new PutEventsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put Events Result",
      description: "Result from PutEvents operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          FailedEntryCount: {
            type: "number",
            description: "The number of failed entries.",
          },
          Entries: {
            type: "array",
            items: {
              type: "object",
              properties: {
                EventId: {
                  type: "string",
                },
                ErrorCode: {
                  type: "string",
                },
                ErrorMessage: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "The successfully and unsuccessfully ingested events results.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default putEvents;
