import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DescribeReplaceRootVolumeTasksCommand,
} from "@aws-sdk/client-ec2";

const describeReplaceRootVolumeTasks: AppBlock = {
  name: "Describe Replace Root Volume Tasks",
  description: "Describes a root volume replacement task.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ReplaceRootVolumeTaskIds: {
          name: "Replace Root Volume Task Ids",
          description: "The ID of the root volume replacement task to view.",
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
          description:
            "Filter to use: instance-id - The ID of the instance for which the root volume replacement task was created.",
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
            "The maximum number of items to return for this request.",
          type: "number",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "The token returned from a previous paginated request.",
          type: "string",
          required: false,
        },
        DryRun: {
          name: "Dry Run",
          description:
            "Checks whether you have the required permissions for the action, without actually making the request, and provides an error response.",
          type: "boolean",
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

        const command = new DescribeReplaceRootVolumeTasksCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Replace Root Volume Tasks Result",
      description: "Result from DescribeReplaceRootVolumeTasks operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ReplaceRootVolumeTasks: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ReplaceRootVolumeTaskId: {
                  type: "string",
                },
                InstanceId: {
                  type: "string",
                },
                TaskState: {
                  type: "string",
                },
                StartTime: {
                  type: "string",
                },
                CompleteTime: {
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
                ImageId: {
                  type: "string",
                },
                SnapshotId: {
                  type: "string",
                },
                DeleteReplacedRootVolume: {
                  type: "boolean",
                },
              },
              additionalProperties: false,
            },
            description: "Information about the root volume replacement task.",
          },
          NextToken: {
            type: "string",
            description:
              "The token to include in another request to get the next page of items.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeReplaceRootVolumeTasks;
