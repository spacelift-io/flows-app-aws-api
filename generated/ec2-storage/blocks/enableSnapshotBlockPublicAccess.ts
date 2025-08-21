import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  EnableSnapshotBlockPublicAccessCommand,
} from "@aws-sdk/client-ec2";

const enableSnapshotBlockPublicAccess: AppBlock = {
  name: "Enable Snapshot Block Public Access",
  description:
    "Enables or modifies the block public access for snapshots setting at the account level for the specified Amazon Web Services Region.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        State: {
          name: "State",
          description:
            "The mode in which to enable block public access for snapshots for the Region.",
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

        const command = new EnableSnapshotBlockPublicAccessCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Enable Snapshot Block Public Access Result",
      description: "Result from EnableSnapshotBlockPublicAccess operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          State: {
            type: "string",
            description:
              "The state of block public access for snapshots for the account and Region.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default enableSnapshotBlockPublicAccess;
