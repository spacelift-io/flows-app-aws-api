import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, RestoreSnapshotTierCommand } from "@aws-sdk/client-ec2";

const restoreSnapshotTier: AppBlock = {
  name: "Restore Snapshot Tier",
  description:
    "Restores an archived Amazon EBS snapshot for use temporarily or permanently, or modifies the restore period or restore type for a snapshot that was previously temporarily restored.",
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
        TemporaryRestoreDays: {
          name: "Temporary Restore Days",
          description:
            "Specifies the number of days for which to temporarily restore an archived snapshot.",
          type: "number",
          required: false,
        },
        PermanentRestore: {
          name: "Permanent Restore",
          description:
            "Indicates whether to permanently restore an archived snapshot.",
          type: "boolean",
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

        const command = new RestoreSnapshotTierCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Restore Snapshot Tier Result",
      description: "Result from RestoreSnapshotTier operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          SnapshotId: {
            type: "string",
            description: "The ID of the snapshot.",
          },
          RestoreStartTime: {
            type: "string",
            description:
              "The date and time when the snapshot restore process started.",
          },
          RestoreDuration: {
            type: "number",
            description: "For temporary restores only.",
          },
          IsPermanentRestore: {
            type: "boolean",
            description:
              "Indicates whether the snapshot is permanently restored.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default restoreSnapshotTier;
