import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  CreateReplaceRootVolumeTaskCommand,
} from "@aws-sdk/client-ec2";

const createReplaceRootVolumeTask: AppBlock = {
  name: "Create Replace Root Volume Task",
  description:
    "Replaces the EBS-backed root volume for a running instance with a new volume that is restored to the original root volume's launch state, that is restored to a specific snapshot taken from the original root volume, or that is restored from an AMI that has the same key characteristics as that of the instance.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        InstanceId: {
          name: "Instance Id",
          description:
            "The ID of the instance for which to replace the root volume.",
          type: "string",
          required: true,
        },
        SnapshotId: {
          name: "Snapshot Id",
          description:
            "The ID of the snapshot from which to restore the replacement root volume.",
          type: "string",
          required: false,
        },
        ClientToken: {
          name: "Client Token",
          description:
            "Unique, case-sensitive identifier you provide to ensure the idempotency of the request.",
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
        TagSpecifications: {
          name: "Tag Specifications",
          description: "The tags to apply to the root volume replacement task.",
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
        ImageId: {
          name: "Image Id",
          description: "The ID of the AMI to use to restore the root volume.",
          type: "string",
          required: false,
        },
        DeleteReplacedRootVolume: {
          name: "Delete Replaced Root Volume",
          description:
            "Indicates whether to automatically delete the original root volume after the root volume replacement task completes.",
          type: "boolean",
          required: false,
        },
        VolumeInitializationRate: {
          name: "Volume Initialization Rate",
          description:
            "Specifies the Amazon EBS Provisioned Rate for Volume Initialization (volume initialization rate), in MiB/s, at which to download the snapshot blocks from Amazon S3 to the replacement root volume.",
          type: "number",
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

        const command = new CreateReplaceRootVolumeTaskCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Replace Root Volume Task Result",
      description: "Result from CreateReplaceRootVolumeTask operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ReplaceRootVolumeTask: {
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
                      type: "string",
                    },
                    Value: {
                      type: "string",
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
            description: "Information about the root volume replacement task.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createReplaceRootVolumeTask;
