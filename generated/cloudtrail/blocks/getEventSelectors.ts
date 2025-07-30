import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudTrailClient,
  GetEventSelectorsCommand,
} from "@aws-sdk/client-cloudtrail";

const getEventSelectors: AppBlock = {
  name: "Get Event Selectors",
  description:
    "Describes the settings for the event selectors that you configured for your trail.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        TrailName: {
          name: "Trail Name",
          description: "Specifies the name of the trail or trail ARN.",
          type: "string",
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

        const command = new GetEventSelectorsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Event Selectors Result",
      description: "Result from GetEventSelectors operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          TrailARN: {
            type: "string",
            description:
              "The specified trail ARN that has the event selectors.",
          },
          EventSelectors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ReadWriteType: {
                  type: "string",
                },
                IncludeManagementEvents: {
                  type: "boolean",
                },
                DataResources: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Type: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Values: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                ExcludeManagementEventSources: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
              additionalProperties: false,
            },
            description:
              "The event selectors that are configured for the trail.",
          },
          AdvancedEventSelectors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Name: {
                  type: "string",
                },
                FieldSelectors: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Field: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Equals: {
                        type: "object",
                        additionalProperties: true,
                      },
                      StartsWith: {
                        type: "object",
                        additionalProperties: true,
                      },
                      EndsWith: {
                        type: "object",
                        additionalProperties: true,
                      },
                      NotEquals: {
                        type: "object",
                        additionalProperties: true,
                      },
                      NotStartsWith: {
                        type: "object",
                        additionalProperties: true,
                      },
                      NotEndsWith: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    required: ["Field"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["FieldSelectors"],
              additionalProperties: false,
            },
            description:
              "The advanced event selectors that are configured for the trail.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getEventSelectors;
