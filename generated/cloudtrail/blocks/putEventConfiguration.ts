import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudTrailClient,
  PutEventConfigurationCommand,
} from "@aws-sdk/client-cloudtrail";

const putEventConfiguration: AppBlock = {
  name: "Put Event Configuration",
  description:
    "Updates the event configuration settings for the specified event data store.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        EventDataStore: {
          name: "Event Data Store",
          description:
            "The Amazon Resource Name (ARN) or ID suffix of the ARN of the event data store for which you want to update event configuration settings.",
          type: "string",
          required: false,
        },
        MaxEventSize: {
          name: "Max Event Size",
          description:
            "The maximum allowed size for events to be stored in the specified event data store.",
          type: "string",
          required: true,
        },
        ContextKeySelectors: {
          name: "Context Key Selectors",
          description:
            "A list of context key selectors that will be included to provide enriched event data.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Type: {
                  type: "string",
                },
                Equals: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
              required: ["Type", "Equals"],
              additionalProperties: false,
            },
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new CloudTrailClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new PutEventConfigurationCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put Event Configuration Result",
      description: "Result from PutEventConfiguration operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          EventDataStoreArn: {
            type: "string",
            description:
              "The Amazon Resource Name (ARN) or ID suffix of the ARN of the event data store for which the event configuration settings were updated.",
          },
          MaxEventSize: {
            type: "string",
            description:
              "The maximum allowed size for events stored in the specified event data store.",
          },
          ContextKeySelectors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Type: {
                  type: "string",
                },
                Equals: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
              required: ["Type", "Equals"],
              additionalProperties: false,
            },
            description:
              "The list of context key selectors that are configured for the event data store.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default putEventConfiguration;
