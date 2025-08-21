import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, ModifySnapshotTierCommand } from "@aws-sdk/client-ec2";

const modifySnapshotTier: AppBlock = {
  name: "Modify Snapshot Tier",
  description: "Archives an Amazon EBS snapshot.",
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
          description: "The ID of the snapshot.",
          type: "string",
          required: true,
        },
        StorageTier: {
          name: "Storage Tier",
          description: "The name of the storage tier.",
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

        const command = new ModifySnapshotTierCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify Snapshot Tier Result",
      description: "Result from ModifySnapshotTier operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          SnapshotId: {
            type: "string",
            description: "The ID of the snapshot.",
          },
          TieringStartTime: {
            type: "string",
            description:
              "The date and time when the archive process was started.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default modifySnapshotTier;
