import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, CopyImageCommand } from "@aws-sdk/client-ec2";

const copyImage: AppBlock = {
  name: "Copy Image",
  description: "Initiates an AMI copy operation.",
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
          description:
            "Unique, case-sensitive identifier you provide to ensure idempotency of the request.",
          type: "string",
          required: false,
        },
        Description: {
          name: "Description",
          description:
            "A description for the new AMI in the destination Region.",
          type: "string",
          required: false,
        },
        Encrypted: {
          name: "Encrypted",
          description:
            "Specifies whether the destination snapshots of the copied image should be encrypted.",
          type: "boolean",
          required: false,
        },
        KmsKeyId: {
          name: "Kms Key Id",
          description:
            "The identifier of the symmetric Key Management Service (KMS) KMS key to use when creating encrypted volumes.",
          type: "string",
          required: false,
        },
        Name: {
          name: "Name",
          description: "The name of the new AMI in the destination Region.",
          type: "string",
          required: true,
        },
        SourceImageId: {
          name: "Source Image Id",
          description: "The ID of the AMI to copy.",
          type: "string",
          required: true,
        },
        SourceRegion: {
          name: "Source Region",
          description: "The name of the Region that contains the AMI to copy.",
          type: "string",
          required: true,
        },
        DestinationOutpostArn: {
          name: "Destination Outpost Arn",
          description:
            "The Amazon Resource Name (ARN) of the Outpost to which to copy the AMI.",
          type: "string",
          required: false,
        },
        CopyImageTags: {
          name: "Copy Image Tags",
          description:
            "Indicates whether to include your user-defined AMI tags when copying the AMI.",
          type: "boolean",
          required: false,
        },
        TagSpecifications: {
          name: "Tag Specifications",
          description: "The tags to apply to the new AMI and new snapshots.",
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
        SnapshotCopyCompletionDurationMinutes: {
          name: "Snapshot Copy Completion Duration Minutes",
          description:
            "Specify a completion duration, in 15 minute increments, to initiate a time-based AMI copy.",
          type: "number",
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

        const command = new CopyImageCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Copy Image Result",
      description: "Result from CopyImage operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ImageId: {
            type: "string",
            description: "The ID of the new AMI.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default copyImage;
