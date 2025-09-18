import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  BatchModifyClusterSnapshotsCommand,
} from "@aws-sdk/client-redshift";

const batchModifyClusterSnapshots: AppBlock = {
  name: "Batch Modify Cluster Snapshots",
  description: `Modifies the settings for a set of cluster snapshots.`,
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        SnapshotIdentifierList: {
          name: "Snapshot Identifier List",
          description: "A list of snapshot identifiers you want to modify.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: true,
        },
        ManualSnapshotRetentionPeriod: {
          name: "Manual Snapshot Retention Period",
          description: "The number of days that a manual snapshot is retained.",
          type: "number",
          required: false,
        },
        Force: {
          name: "Force",
          description:
            "A boolean value indicating whether to override an exception if the retention period has passed.",
          type: "boolean",
          required: false,
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

        const command = new BatchModifyClusterSnapshotsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Batch Modify Cluster Snapshots Result",
      description: "Result from BatchModifyClusterSnapshots operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Resources: {
            type: "array",
            items: {
              type: "string",
            },
            description: "A list of the snapshots that were modified.",
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

export default batchModifyClusterSnapshots;
