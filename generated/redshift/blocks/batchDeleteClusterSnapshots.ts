import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  BatchDeleteClusterSnapshotsCommand,
} from "@aws-sdk/client-redshift";

const batchDeleteClusterSnapshots: AppBlock = {
  name: "Batch Delete Cluster Snapshots",
  description: `Deletes a set of cluster snapshots.`,
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Identifiers: {
          name: "Identifiers",
          description:
            "A list of identifiers for the snapshots that you want to delete.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                SnapshotIdentifier: {
                  type: "string",
                },
                SnapshotClusterIdentifier: {
                  type: "string",
                },
              },
              required: ["SnapshotIdentifier"],
              additionalProperties: false,
            },
          },
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

        const command = new BatchDeleteClusterSnapshotsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Batch Delete Cluster Snapshots Result",
      description: "Result from BatchDeleteClusterSnapshots operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Resources: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "A list of the snapshot identifiers that were deleted.",
          },
          Errors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                SnapshotIdentifier: {
                  type: "string",
                },
                SnapshotClusterIdentifier: {
                  type: "string",
                },
                FailureCode: {
                  type: "string",
                },
                FailureReason: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "A list of any errors returned.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default batchDeleteClusterSnapshots;
