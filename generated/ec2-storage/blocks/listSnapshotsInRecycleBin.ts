import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  ListSnapshotsInRecycleBinCommand,
} from "@aws-sdk/client-ec2";

const listSnapshotsInRecycleBin: AppBlock = {
  name: "List Snapshots In Recycle Bin",
  description:
    "Lists one or more snapshots that are currently in the Recycle Bin.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
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
          description: "The IDs of the snapshots to list.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new ListSnapshotsInRecycleBinCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Snapshots In Recycle Bin Result",
      description: "Result from ListSnapshotsInRecycleBin operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Snapshots: {
            type: "array",
            items: {
              type: "object",
              properties: {
                SnapshotId: {
                  type: "string",
                },
                RecycleBinEnterTime: {
                  type: "string",
                },
                RecycleBinExitTime: {
                  type: "string",
                },
                Description: {
                  type: "string",
                },
                VolumeId: {
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

export default listSnapshotsInRecycleBin;
