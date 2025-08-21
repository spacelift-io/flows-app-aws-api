import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, ImportSnapshotCommand } from "@aws-sdk/client-ec2";

const importSnapshot: AppBlock = {
  name: "Import Snapshot",
  description: "Imports a disk into an EBS snapshot.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ClientData: {
          name: "Client Data",
          description: "The client-specific data.",
          type: {
            type: "object",
            properties: {
              Comment: {
                type: "string",
              },
              UploadEnd: {
                type: "string",
              },
              UploadSize: {
                type: "number",
              },
              UploadStart: {
                type: "string",
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        ClientToken: {
          name: "Client Token",
          description: "Token to enable idempotency for VM import requests.",
          type: "string",
          required: false,
        },
        Description: {
          name: "Description",
          description: "The description string for the import snapshot task.",
          type: "string",
          required: false,
        },
        DiskContainer: {
          name: "Disk Container",
          description: "Information about the disk container.",
          type: {
            type: "object",
            properties: {
              Description: {
                type: "string",
              },
              Format: {
                type: "string",
              },
              Url: {
                type: "string",
              },
              UserBucket: {
                type: "object",
                properties: {
                  S3Bucket: {
                    type: "string",
                  },
                  S3Key: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        DryRun: {
          name: "Dry Run",
          description:
            "Checks whether you have the required permissions for the action, without actually making the request, and provides an error response.",
          type: "boolean",
          required: false,
        },
        Encrypted: {
          name: "Encrypted",
          description:
            "Specifies whether the destination snapshot of the imported image should be encrypted.",
          type: "boolean",
          required: false,
        },
        KmsKeyId: {
          name: "Kms Key Id",
          description:
            "An identifier for the symmetric KMS key to use when creating the encrypted snapshot.",
          type: "string",
          required: false,
        },
        RoleName: {
          name: "Role Name",
          description:
            "The name of the role to use when not using the default role, 'vmimport'.",
          type: "string",
          required: false,
        },
        TagSpecifications: {
          name: "Tag Specifications",
          description:
            "The tags to apply to the import snapshot task during creation.",
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

        const command = new ImportSnapshotCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Import Snapshot Result",
      description: "Result from ImportSnapshot operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Description: {
            type: "string",
            description: "A description of the import snapshot task.",
          },
          ImportTaskId: {
            type: "string",
            description: "The ID of the import snapshot task.",
          },
          SnapshotTaskDetail: {
            type: "object",
            properties: {
              Description: {
                type: "string",
              },
              DiskImageSize: {
                type: "number",
              },
              Encrypted: {
                type: "boolean",
              },
              Format: {
                type: "string",
              },
              KmsKeyId: {
                type: "string",
              },
              Progress: {
                type: "string",
              },
              SnapshotId: {
                type: "string",
              },
              Status: {
                type: "string",
              },
              StatusMessage: {
                type: "string",
              },
              Url: {
                type: "string",
              },
              UserBucket: {
                type: "object",
                properties: {
                  S3Bucket: {
                    type: "string",
                  },
                  S3Key: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
            },
            additionalProperties: false,
            description: "Information about the import snapshot task.",
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
            description: "Any tags assigned to the import snapshot task.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default importSnapshot;
