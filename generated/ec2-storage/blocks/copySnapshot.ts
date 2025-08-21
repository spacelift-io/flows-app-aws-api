import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, CopySnapshotCommand } from "@aws-sdk/client-ec2";

const copySnapshot: AppBlock = {
  name: "Copy Snapshot",
  description:
    "Copies a point-in-time snapshot of an EBS volume and stores it in Amazon S3.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Description: {
          name: "Description",
          description: "A description for the EBS snapshot.",
          type: "string",
          required: false,
        },
        DestinationOutpostArn: {
          name: "Destination Outpost Arn",
          description:
            "The Amazon Resource Name (ARN) of the Outpost to which to copy the snapshot.",
          type: "string",
          required: false,
        },
        DestinationRegion: {
          name: "Destination Region",
          description:
            "The destination Region to use in the PresignedUrl parameter of a snapshot copy operation.",
          type: "string",
          required: false,
        },
        Encrypted: {
          name: "Encrypted",
          description:
            "To encrypt a copy of an unencrypted snapshot if encryption by default is not enabled, enable encryption using this parameter.",
          type: "boolean",
          required: false,
        },
        KmsKeyId: {
          name: "Kms Key Id",
          description:
            "The identifier of the KMS key to use for Amazon EBS encryption.",
          type: "string",
          required: false,
        },
        PresignedUrl: {
          name: "Presigned Url",
          description:
            "When you copy an encrypted source snapshot using the Amazon EC2 Query API, you must supply a pre-signed URL.",
          type: "string",
          required: false,
        },
        SourceRegion: {
          name: "Source Region",
          description:
            "The ID of the Region that contains the snapshot to be copied.",
          type: "string",
          required: true,
        },
        SourceSnapshotId: {
          name: "Source Snapshot Id",
          description: "The ID of the EBS snapshot to copy.",
          type: "string",
          required: true,
        },
        TagSpecifications: {
          name: "Tag Specifications",
          description: "The tags to apply to the new snapshot.",
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
        CompletionDurationMinutes: {
          name: "Completion Duration Minutes",
          description:
            "Specify a completion duration, in 15 minute increments, to initiate a time-based snapshot copy.",
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

        const command = new CopySnapshotCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Copy Snapshot Result",
      description: "Result from CopySnapshot operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
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
            description: "Any tags applied to the new snapshot.",
          },
          SnapshotId: {
            type: "string",
            description: "The ID of the new snapshot.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default copySnapshot;
