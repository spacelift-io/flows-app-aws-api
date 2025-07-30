import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  GetSnapshotBlockPublicAccessStateCommand,
} from "@aws-sdk/client-ec2";

const getSnapshotBlockPublicAccessState: AppBlock = {
  name: "Get Snapshot Block Public Access State",
  description:
    "Gets the current state of block public access for snapshots setting for the account and Region.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
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

        const command = new GetSnapshotBlockPublicAccessStateCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Snapshot Block Public Access State Result",
      description: "Result from GetSnapshotBlockPublicAccessState operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          State: {
            type: "string",
            description:
              "The current state of block public access for snapshots.",
          },
          ManagedBy: {
            type: "string",
            description:
              "The entity that manages the state for block public access for snapshots.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getSnapshotBlockPublicAccessState;
