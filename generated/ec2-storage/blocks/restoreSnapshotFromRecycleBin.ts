import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  RestoreSnapshotFromRecycleBinCommand,
} from "@aws-sdk/client-ec2";

const restoreSnapshotFromRecycleBin: AppBlock = {
  name: "Restore Snapshot From Recycle Bin",
  description: "Restores a snapshot from the Recycle Bin.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        SnapshotId: {
          name: "Snapshot Id",
          description: "The ID of the snapshot to restore.",
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

        const command = new RestoreSnapshotFromRecycleBinCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Restore Snapshot From Recycle Bin Result",
      description: "Result from RestoreSnapshotFromRecycleBin operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          SnapshotId: {
            type: "string",
            description: "The ID of the snapshot.",
          },
          OutpostArn: {
            type: "string",
            description:
              "The ARN of the Outpost on which the snapshot is stored.",
          },
          Description: {
            type: "string",
            description: "The description for the snapshot.",
          },
          Encrypted: {
            type: "boolean",
            description: "Indicates whether the snapshot is encrypted.",
          },
          OwnerId: {
            type: "string",
            description:
              "The ID of the Amazon Web Services account that owns the EBS snapshot.",
          },
          Progress: {
            type: "string",
            description: "The progress of the snapshot, as a percentage.",
          },
          StartTime: {
            type: "string",
            description: "The time stamp when the snapshot was initiated.",
          },
          State: {
            type: "string",
            description: "The state of the snapshot.",
          },
          VolumeId: {
            type: "string",
            description:
              "The ID of the volume that was used to create the snapshot.",
          },
          VolumeSize: {
            type: "number",
            description: "The size of the volume, in GiB.",
          },
          SseType: {
            type: "string",
            description: "Reserved for future use.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default restoreSnapshotFromRecycleBin;
