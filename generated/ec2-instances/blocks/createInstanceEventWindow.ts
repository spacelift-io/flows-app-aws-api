import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  CreateInstanceEventWindowCommand,
} from "@aws-sdk/client-ec2";

const createInstanceEventWindow: AppBlock = {
  name: "Create Instance Event Window",
  description:
    "Creates an event window in which scheduled events for the associated Amazon EC2 instances can run.",
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
        Name: {
          name: "Name",
          description: "The name of the event window.",
          type: "string",
          required: false,
        },
        TimeRanges: {
          name: "Time Ranges",
          description: "The time range for the event window.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                StartWeekDay: {
                  type: "string",
                },
                StartHour: {
                  type: "number",
                },
                EndWeekDay: {
                  type: "string",
                },
                EndHour: {
                  type: "number",
                },
              },
              additionalProperties: false,
            },
          },
          required: false,
        },
        CronExpression: {
          name: "Cron Expression",
          description:
            "The cron expression for the event window, for example, * 0-4,20-23 * * 1,5.",
          type: "string",
          required: false,
        },
        TagSpecifications: {
          name: "Tag Specifications",
          description: "The tags to apply to the event window.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ResourceType: {
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
        });

        const command = new CreateInstanceEventWindowCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Instance Event Window Result",
      description: "Result from CreateInstanceEventWindow operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          InstanceEventWindow: {
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
                      type: "string",
                    },
                    StartHour: {
                      type: "number",
                    },
                    EndWeekDay: {
                      type: "string",
                    },
                    EndHour: {
                      type: "number",
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
                      type: "string",
                    },
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
                  DedicatedHostIds: {
                    type: "array",
                    items: {
                      type: "string",
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
                      type: "string",
                    },
                    Value: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
            },
            additionalProperties: false,
            description: "Information about the event window.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createInstanceEventWindow;
