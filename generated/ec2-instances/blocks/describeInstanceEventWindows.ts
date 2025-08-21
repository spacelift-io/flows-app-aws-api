import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DescribeInstanceEventWindowsCommand,
} from "@aws-sdk/client-ec2";

const describeInstanceEventWindows: AppBlock = {
  name: "Describe Instance Event Windows",
  description: "Describes the specified event windows or all event windows.",
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
        InstanceEventWindowIds: {
          name: "Instance Event Window Ids",
          description: "The IDs of the event windows.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        Filters: {
          name: "Filters",
          description: "One or more filters.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Name: {
                  type: "string",
                },
                Values: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
              additionalProperties: false,
            },
          },
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description:
            "The maximum number of results to return in a single call.",
          type: "number",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "The token to request the next page of results.",
          type: "string",
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

        const command = new DescribeInstanceEventWindowsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Instance Event Windows Result",
      description: "Result from DescribeInstanceEventWindows operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          InstanceEventWindows: {
            type: "array",
            items: {
              type: "object",
              properties: {
                InstanceEventWindowId: {
                  type: "string",
                },
                TimeRanges: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      StartWeekDay: {
                        type: "object",
                        additionalProperties: true,
                      },
                      StartHour: {
                        type: "object",
                        additionalProperties: true,
                      },
                      EndWeekDay: {
                        type: "object",
                        additionalProperties: true,
                      },
                      EndHour: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                Name: {
                  type: "string",
                },
                CronExpression: {
                  type: "string",
                },
                AssociationTarget: {
                  type: "object",
                  properties: {
                    InstanceIds: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    Tags: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    DedicatedHostIds: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                  },
                  additionalProperties: false,
                },
                State: {
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
            description: "Information about the event windows.",
          },
          NextToken: {
            type: "string",
            description:
              "The token to use to retrieve the next page of results.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeInstanceEventWindows;
