import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, DescribeConversionTasksCommand } from "@aws-sdk/client-ec2";

const describeConversionTasks: AppBlock = {
  name: "Describe Conversion Tasks",
  description:
    "Describes the specified conversion tasks or all your conversion tasks.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DryRun: {
          name: "Dry Run",
          description:
            "Checks whether you have the required permissions for the action, without actually making the request, and provides an error response.",
          type: "boolean",
          required: false,
        },
        ConversionTaskIds: {
          name: "Conversion Task Ids",
          description: "The conversion task IDs.",
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

        const client = new EC2Client({
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

        const command = new DescribeConversionTasksCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Conversion Tasks Result",
      description: "Result from DescribeConversionTasks operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ConversionTasks: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ConversionTaskId: {
                  type: "string",
                },
                ExpirationTime: {
                  type: "string",
                },
                ImportInstance: {
                  type: "object",
                  properties: {
                    Description: {
                      type: "string",
                    },
                    InstanceId: {
                      type: "string",
                    },
                    Platform: {
                      type: "string",
                    },
                    Volumes: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                  },
                  additionalProperties: false,
                },
                ImportVolume: {
                  type: "object",
                  properties: {
                    AvailabilityZone: {
                      type: "string",
                    },
                    BytesConverted: {
                      type: "number",
                    },
                    Description: {
                      type: "string",
                    },
                    Image: {
                      type: "object",
                      properties: {
                        Checksum: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Format: {
                          type: "object",
                          additionalProperties: true,
                        },
                        ImportManifestUrl: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Size: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                    Volume: {
                      type: "object",
                      properties: {
                        Id: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Size: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                  },
                  additionalProperties: false,
                },
                State: {
                  type: "string",
                },
                StatusMessage: {
                  type: "string",
                },
                Tags: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Key: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Value: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
              },
              additionalProperties: false,
            },
            description: "Information about the conversion tasks.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeConversionTasks;
