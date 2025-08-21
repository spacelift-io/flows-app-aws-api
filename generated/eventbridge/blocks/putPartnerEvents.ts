import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EventBridgeClient,
  PutPartnerEventsCommand,
} from "@aws-sdk/client-eventbridge";

const putPartnerEvents: AppBlock = {
  name: "Put Partner Events",
  description:
    "This is used by SaaS partners to write events to a customer's partner event bus.",
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
          description: "The list of events to write to the event bus.",
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
              },
              additionalProperties: false,
            },
          },
          required: true,
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

        const command = new PutPartnerEventsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put Partner Events Result",
      description: "Result from PutPartnerEvents operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          FailedEntryCount: {
            type: "number",
            description:
              "The number of events from this operation that could not be written to the partner event bus.",
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
              "The results for each event entry the partner submitted in this request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default putPartnerEvents;
