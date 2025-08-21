import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, ExportImageCommand } from "@aws-sdk/client-ec2";

const exportImage: AppBlock = {
  name: "Export Image",
  description: "Exports an Amazon Machine Image (AMI) to a VM file.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ClientToken: {
          name: "Client Token",
          description: "Token to enable idempotency for export image requests.",
          type: "string",
          required: false,
        },
        Description: {
          name: "Description",
          description: "A description of the image being exported.",
          type: "string",
          required: false,
        },
        DiskImageFormat: {
          name: "Disk Image Format",
          description: "The disk image format.",
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
        ImageId: {
          name: "Image Id",
          description: "The ID of the image.",
          type: "string",
          required: true,
        },
        S3ExportLocation: {
          name: "S3Export Location",
          description: "The Amazon S3 bucket for the destination image.",
          type: {
            type: "object",
            properties: {
              S3Bucket: {
                type: "string",
              },
              S3Prefix: {
                type: "string",
              },
            },
            required: ["S3Bucket"],
            additionalProperties: false,
          },
          required: true,
        },
        RoleName: {
          name: "Role Name",
          description:
            "The name of the role that grants VM Import/Export permission to export images to your Amazon S3 bucket.",
          type: "string",
          required: false,
        },
        TagSpecifications: {
          name: "Tag Specifications",
          description:
            "The tags to apply to the export image task during creation.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new ExportImageCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Export Image Result",
      description: "Result from ExportImage operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Description: {
            type: "string",
            description: "A description of the image being exported.",
          },
          DiskImageFormat: {
            type: "string",
            description: "The disk image format for the exported image.",
          },
          ExportImageTaskId: {
            type: "string",
            description: "The ID of the export image task.",
          },
          ImageId: {
            type: "string",
            description: "The ID of the image.",
          },
          RoleName: {
            type: "string",
            description:
              "The name of the role that grants VM Import/Export permission to export images to your Amazon S3 bucket.",
          },
          Progress: {
            type: "string",
            description: "The percent complete of the export image task.",
          },
          S3ExportLocation: {
            type: "object",
            properties: {
              S3Bucket: {
                type: "string",
              },
              S3Prefix: {
                type: "string",
              },
            },
            additionalProperties: false,
            description: "Information about the destination Amazon S3 bucket.",
          },
          Status: {
            type: "string",
            description: "The status of the export image task.",
          },
          StatusMessage: {
            type: "string",
            description: "The status message for the export image task.",
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
            description: "Any tags assigned to the export image task.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default exportImage;
