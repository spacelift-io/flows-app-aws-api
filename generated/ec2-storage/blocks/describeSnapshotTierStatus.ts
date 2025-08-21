import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DescribeSnapshotTierStatusCommand,
} from "@aws-sdk/client-ec2";

const describeSnapshotTierStatus: AppBlock = {
  name: "Describe Snapshot Tier Status",
  description:
    "Describes the storage tier status of one or more Amazon EBS snapshots.",
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
          description: "The filters.",
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
        DryRun: {
          name: "Dry Run",
          description:
            "Checks whether you have the required permissions for the action, without actually making the request, and provides an error response.",
          type: "boolean",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "The token returned from a previous paginated request.",
          type: "string",
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description:
            "The maximum number of items to return for this request.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new DescribeSnapshotTierStatusCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Snapshot Tier Status Result",
      description: "Result from DescribeSnapshotTierStatus operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          SnapshotTierStatuses: {
            type: "array",
            items: {
              type: "object",
              properties: {
                SnapshotId: {
                  type: "string",
                },
                VolumeId: {
                  type: "string",
                },
                Status: {
                  type: "string",
                },
                OwnerId: {
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
                StorageTier: {
                  type: "string",
                },
                LastTieringStartTime: {
                  type: "string",
                },
                LastTieringProgress: {
                  type: "number",
                },
                LastTieringOperationStatus: {
                  type: "string",
                },
                LastTieringOperationStatusDetail: {
                  type: "string",
                },
                ArchivalCompleteTime: {
                  type: "string",
                },
                RestoreExpiryTime: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "Information about the snapshot's storage tier.",
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

export default describeSnapshotTierStatus;
