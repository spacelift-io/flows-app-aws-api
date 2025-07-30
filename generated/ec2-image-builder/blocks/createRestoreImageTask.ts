import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, CreateRestoreImageTaskCommand } from "@aws-sdk/client-ec2";

const createRestoreImageTask: AppBlock = {
  name: "Create Restore Image Task",
  description:
    "Starts a task that restores an AMI from an Amazon S3 object that was previously created by using CreateStoreImageTask.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Bucket: {
          name: "Bucket",
          description:
            "The name of the Amazon S3 bucket that contains the stored AMI object.",
          type: "string",
          required: true,
        },
        ObjectKey: {
          name: "Object Key",
          description: "The name of the stored AMI object in the bucket.",
          type: "string",
          required: true,
        },
        Name: {
          name: "Name",
          description: "The name for the restored AMI.",
          type: "string",
          required: false,
        },
        TagSpecifications: {
          name: "Tag Specifications",
          description:
            "The tags to apply to the AMI and snapshots on restoration.",
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
        });

        const command = new CreateRestoreImageTaskCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Restore Image Task Result",
      description: "Result from CreateRestoreImageTask operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ImageId: {
            type: "string",
            description: "The AMI ID.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createRestoreImageTask;
