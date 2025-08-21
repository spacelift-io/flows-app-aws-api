import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, DescribeExportTasksCommand } from "@aws-sdk/client-ec2";

const describeExportTasks: AppBlock = {
  name: "Describe Export Tasks",
  description:
    "Describes the specified export instance tasks or all of your export instance tasks.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Filters: {
          name: "Filters",
          description: "the filters for the export tasks.",
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
        ExportTaskIds: {
          name: "Export Task Ids",
          description: "The export task IDs.",
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

        const command = new DescribeExportTasksCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Export Tasks Result",
      description: "Result from DescribeExportTasks operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ExportTasks: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Description: {
                  type: "string",
                },
                ExportTaskId: {
                  type: "string",
                },
                ExportToS3Task: {
                  type: "object",
                  properties: {
                    ContainerFormat: {
                      type: "string",
                    },
                    DiskImageFormat: {
                      type: "string",
                    },
                    S3Bucket: {
                      type: "string",
                    },
                    S3Key: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
                InstanceExportDetails: {
                  type: "object",
                  properties: {
                    InstanceId: {
                      type: "string",
                    },
                    TargetEnvironment: {
                      type: "string",
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
            description: "Information about the export tasks.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeExportTasks;
