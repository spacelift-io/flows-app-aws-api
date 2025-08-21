import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  ModifyInstanceEventWindowCommand,
} from "@aws-sdk/client-ec2";

const modifyInstanceEventWindow: AppBlock = {
  name: "Modify Instance Event Window",
  description: "Modifies the specified event window.",
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
        InstanceEventWindowId: {
          name: "Instance Event Window Id",
          description: "The ID of the event window.",
          type: "string",
          required: true,
        },
        TimeRanges: {
          name: "Time Ranges",
          description: "The time ranges of the event window.",
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
            "The cron expression of the event window, for example, * 0-4,20-23 * * 1,5.",
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

        const command = new ModifyInstanceEventWindowCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify Instance Event Window Result",
      description: "Result from ModifyInstanceEventWindow operation",
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

export default modifyInstanceEventWindow;
