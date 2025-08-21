import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  CreateInstanceExportTaskCommand,
} from "@aws-sdk/client-ec2";

const createInstanceExportTask: AppBlock = {
  name: "Create Instance Export Task",
  description: "Exports a running or stopped instance to an Amazon S3 bucket.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        TagSpecifications: {
          name: "Tag Specifications",
          description:
            "The tags to apply to the export instance task during creation.",
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
        Description: {
          name: "Description",
          description:
            "A description for the conversion task or the resource being exported.",
          type: "string",
          required: false,
        },
        InstanceId: {
          name: "Instance Id",
          description: "The ID of the instance.",
          type: "string",
          required: true,
        },
        TargetEnvironment: {
          name: "Target Environment",
          description: "The target virtualization environment.",
          type: "string",
          required: true,
        },
        ExportToS3Task: {
          name: "Export To S3Task",
          description: "The format and location for an export instance task.",
          type: {
            type: "object",
            properties: {
              DiskImageFormat: {
                type: "string",
              },
              ContainerFormat: {
                type: "string",
              },
              S3Bucket: {
                type: "string",
              },
              S3Prefix: {
                type: "string",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new CreateInstanceExportTaskCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Instance Export Task Result",
      description: "Result from CreateInstanceExportTask operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ExportTask: {
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
            description: "Information about the export instance task.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createInstanceExportTask;
