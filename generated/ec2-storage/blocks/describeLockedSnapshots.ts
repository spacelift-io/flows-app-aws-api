import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, DescribeLockedSnapshotsCommand } from "@aws-sdk/client-ec2";

const describeLockedSnapshots: AppBlock = {
  name: "Describe Locked Snapshots",
  description: "Describes the lock status for a snapshot.",
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
        SnapshotIds: {
          name: "Snapshot Ids",
          description:
            "The IDs of the snapshots for which to view the lock status.",
          type: {
            type: "array",
            items: {
              type: "string",
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

        const command = new DescribeLockedSnapshotsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Locked Snapshots Result",
      description: "Result from DescribeLockedSnapshots operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Snapshots: {
            type: "array",
            items: {
              type: "object",
              properties: {
                OwnerId: {
                  type: "string",
                },
                SnapshotId: {
                  type: "string",
                },
                LockState: {
                  type: "string",
                },
                LockDuration: {
                  type: "number",
                },
                CoolOffPeriod: {
                  type: "number",
                },
                CoolOffPeriodExpiresOn: {
                  type: "string",
                },
                LockCreatedOn: {
                  type: "string",
                },
                LockDurationStartTime: {
                  type: "string",
                },
                LockExpiresOn: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "Information about the snapshots.",
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

export default describeLockedSnapshots;
