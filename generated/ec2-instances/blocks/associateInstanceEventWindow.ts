import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  AssociateInstanceEventWindowCommand,
} from "@aws-sdk/client-ec2";

const associateInstanceEventWindow: AppBlock = {
  name: "Associate Instance Event Window",
  description: "Associates one or more targets with an event window.",
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
        InstanceEventWindowId: {
          name: "Instance Event Window Id",
          description: "The ID of the event window.",
          type: "string",
          required: true,
        },
        AssociationTarget: {
          name: "Association Target",
          description:
            "One or more targets associated with the specified event window.",
          type: {
            type: "object",
            properties: {
              InstanceIds: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              InstanceTags: {
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
              DedicatedHostIds: {
                type: "array",
                items: {
                  type: "string",
                },
              },
            },
            additionalProperties: false,
          },
          required: true,
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

        const command = new AssociateInstanceEventWindowCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Associate Instance Event Window Result",
      description: "Result from AssociateInstanceEventWindow operation",
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

export default associateInstanceEventWindow;
