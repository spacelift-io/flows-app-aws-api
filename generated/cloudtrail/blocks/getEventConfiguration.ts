import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudTrailClient,
  GetEventConfigurationCommand,
} from "@aws-sdk/client-cloudtrail";

const getEventConfiguration: AppBlock = {
  name: "Get Event Configuration",
  description:
    "Retrieves the current event configuration settings for the specified event data store, including details about maximum event size and context key selectors configured for the event data store.",
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
            "The Amazon Resource Name (ARN) or ID suffix of the ARN of the event data store for which you want to retrieve event configuration settings.",
          type: "string",
          required: false,
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new GetEventConfigurationCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Event Configuration Result",
      description: "Result from GetEventConfiguration operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          EventDataStoreArn: {
            type: "string",
            description:
              "The Amazon Resource Name (ARN) or ID suffix of the ARN of the event data store for which the event configuration settings are returned.",
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

export default getEventConfiguration;
