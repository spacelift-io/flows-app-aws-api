import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SESClient,
  UpdateConfigurationSetEventDestinationCommand,
} from "@aws-sdk/client-ses";

const updateConfigurationSetEventDestination: AppBlock = {
  name: "Update Configuration Set Event Destination",
  description: "Updates the event destination of a configuration set.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ConfigurationSetName: {
          name: "Configuration Set Name",
          description:
            "The name of the configuration set that contains the event destination.",
          type: "string",
          required: true,
        },
        EventDestination: {
          name: "Event Destination",
          description: "The event destination object.",
          type: {
            type: "object",
            properties: {
              Name: {
                type: "string",
              },
              Enabled: {
                type: "boolean",
              },
              MatchingEventTypes: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              KinesisFirehoseDestination: {
                type: "object",
                properties: {
                  IAMRoleARN: {
                    type: "string",
                  },
                  DeliveryStreamARN: {
                    type: "string",
                  },
                },
                required: ["IAMRoleARN", "DeliveryStreamARN"],
                additionalProperties: false,
              },
              CloudWatchDestination: {
                type: "object",
                properties: {
                  DimensionConfigurations: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        DimensionName: {
                          type: "object",
                          additionalProperties: true,
                        },
                        DimensionValueSource: {
                          type: "object",
                          additionalProperties: true,
                        },
                        DefaultDimensionValue: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: [
                        "DimensionName",
                        "DimensionValueSource",
                        "DefaultDimensionValue",
                      ],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["DimensionConfigurations"],
                additionalProperties: false,
              },
              SNSDestination: {
                type: "object",
                properties: {
                  TopicARN: {
                    type: "string",
                  },
                },
                required: ["TopicARN"],
                additionalProperties: false,
              },
            },
            required: ["Name", "MatchingEventTypes"],
            additionalProperties: false,
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new SESClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new UpdateConfigurationSetEventDestinationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Configuration Set Event Destination Result",
      description:
        "Result from UpdateConfigurationSetEventDestination operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default updateConfigurationSetEventDestination;
