import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SESClient,
  DescribeConfigurationSetCommand,
} from "@aws-sdk/client-ses";

const describeConfigurationSet: AppBlock = {
  name: "Describe Configuration Set",
  description: "Returns the details of the specified configuration set.",
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
          description: "The name of the configuration set to describe.",
          type: "string",
          required: true,
        },
        ConfigurationSetAttributeNames: {
          name: "Configuration Set Attribute Names",
          description: "A list of configuration set attributes to return.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new DescribeConfigurationSetCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Configuration Set Result",
      description: "Result from DescribeConfigurationSet operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ConfigurationSet: {
            type: "object",
            properties: {
              Name: {
                type: "string",
              },
            },
            required: ["Name"],
            additionalProperties: false,
            description:
              "The configuration set object associated with the specified configuration set.",
          },
          EventDestinations: {
            type: "array",
            items: {
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
                        additionalProperties: true,
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
            description:
              "A list of event destinations associated with the configuration set.",
          },
          TrackingOptions: {
            type: "object",
            properties: {
              CustomRedirectDomain: {
                type: "string",
              },
            },
            additionalProperties: false,
            description:
              "The name of the custom open and click tracking domain associated with the configuration set.",
          },
          DeliveryOptions: {
            type: "object",
            properties: {
              TlsPolicy: {
                type: "string",
              },
            },
            additionalProperties: false,
            description:
              "Specifies whether messages that use the configuration set are required to use Transport Layer Security (TLS).",
          },
          ReputationOptions: {
            type: "object",
            properties: {
              SendingEnabled: {
                type: "boolean",
              },
              ReputationMetricsEnabled: {
                type: "boolean",
              },
              LastFreshStart: {
                type: "string",
              },
            },
            additionalProperties: false,
            description:
              "An object that represents the reputation settings for the configuration set.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeConfigurationSet;
