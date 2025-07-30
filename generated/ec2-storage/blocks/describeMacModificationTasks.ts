import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DescribeMacModificationTasksCommand,
} from "@aws-sdk/client-ec2";

const describeMacModificationTasks: AppBlock = {
  name: "Describe Mac Modification Tasks",
  description:
    "Describes a System Integrity Protection (SIP) modification task or volume ownership delegation task for an Amazon EC2 Mac instance.",
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
        Filters: {
          name: "Filters",
          description:
            "Specifies one or more filters for the request: instance-id - The ID of the instance for which the task was created.",
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
        MacModificationTaskIds: {
          name: "Mac Modification Task Ids",
          description: "The ID of task.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description:
            "The maximum number of results to return for the request in a single page.",
          type: "number",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "The token to use to retrieve the next page of results.",
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
        });

        const command = new DescribeMacModificationTasksCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Mac Modification Tasks Result",
      description: "Result from DescribeMacModificationTasks operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          MacModificationTasks: {
            type: "array",
            items: {
              type: "object",
              properties: {
                InstanceId: {
                  type: "string",
                },
                MacModificationTaskId: {
                  type: "string",
                },
                MacSystemIntegrityProtectionConfig: {
                  type: "object",
                  properties: {
                    AppleInternal: {
                      type: "string",
                    },
                    BaseSystem: {
                      type: "string",
                    },
                    DebuggingRestrictions: {
                      type: "string",
                    },
                    DTraceRestrictions: {
                      type: "string",
                    },
                    FilesystemProtections: {
                      type: "string",
                    },
                    KextSigning: {
                      type: "string",
                    },
                    NvramProtections: {
                      type: "string",
                    },
                    Status: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
                StartTime: {
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
                TaskState: {
                  type: "string",
                },
                TaskType: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "Information about the tasks.",
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

export default describeMacModificationTasks;
