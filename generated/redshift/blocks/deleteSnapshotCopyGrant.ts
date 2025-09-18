import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  DeleteSnapshotCopyGrantCommand,
} from "@aws-sdk/client-redshift";

const deleteSnapshotCopyGrant: AppBlock = {
  name: "Delete Snapshot Copy Grant",
  description: `Deletes the specified snapshot copy grant.`,
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        SnapshotCopyGrantName: {
          name: "Snapshot Copy Grant Name",
          description: "The name of the snapshot copy grant to delete.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new RedshiftClient({
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

        const command = new DeleteSnapshotCopyGrantCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Snapshot Copy Grant Result",
      description: "Result from DeleteSnapshotCopyGrant operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deleteSnapshotCopyGrant;
