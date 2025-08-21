import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, UnlockSnapshotCommand } from "@aws-sdk/client-ec2";

const unlockSnapshot: AppBlock = {
  name: "Unlock Snapshot",
  description:
    "Unlocks a snapshot that is locked in governance mode or that is locked in compliance mode but still in the cooling-off period.",
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
          description: "The ID of the snapshot to unlock.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new UnlockSnapshotCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Unlock Snapshot Result",
      description: "Result from UnlockSnapshot operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          SnapshotId: {
            type: "string",
            description: "The ID of the snapshot.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default unlockSnapshot;
