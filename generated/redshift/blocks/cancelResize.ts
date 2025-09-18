import { AppBlock, events } from "@slflows/sdk/v1";
import { RedshiftClient, CancelResizeCommand } from "@aws-sdk/client-redshift";

const cancelResize: AppBlock = {
  name: "Cancel Resize",
  description: `Cancels a resize operation for a cluster.`,
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ClusterIdentifier: {
          name: "Cluster Identifier",
          description:
            "The unique identifier for the cluster that you want to cancel a resize operation for.",
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

        const command = new CancelResizeCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Cancel Resize Result",
      description: "Result from CancelResize operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          TargetNodeType: {
            type: "string",
            description:
              "The node type that the cluster will have after the resize operation is complete.",
          },
          TargetNumberOfNodes: {
            type: "number",
            description:
              "The number of nodes that the cluster will have after the resize operation is complete.",
          },
          TargetClusterType: {
            type: "string",
            description:
              "The cluster type after the resize operation is complete.",
          },
          Status: {
            type: "string",
            description: "The status of the resize operation.",
          },
          ImportTablesCompleted: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "The names of tables that have been completely imported .",
          },
          ImportTablesInProgress: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "The names of tables that are being currently imported.",
          },
          ImportTablesNotStarted: {
            type: "array",
            items: {
              type: "string",
            },
            description: "The names of tables that have not been yet imported.",
          },
          AvgResizeRateInMegaBytesPerSecond: {
            type: "number",
            description:
              "The average rate of the resize operation over the last few minutes, measured in megabytes per second.",
          },
          TotalResizeDataInMegaBytes: {
            type: "number",
            description:
              "The estimated total amount of data, in megabytes, on the cluster before the resize operation began.",
          },
          ProgressInMegaBytes: {
            type: "number",
            description:
              "While the resize operation is in progress, this value shows the current amount of data, in megabytes, that has been processed so far.",
          },
          ElapsedTimeInSeconds: {
            type: "number",
            description:
              "The amount of seconds that have elapsed since the resize operation began.",
          },
          EstimatedTimeToCompletionInSeconds: {
            type: "number",
            description:
              "The estimated time remaining, in seconds, until the resize operation is complete.",
          },
          ResizeType: {
            type: "string",
            description:
              "An enum with possible values of ClassicResize and ElasticResize.",
          },
          Message: {
            type: "string",
            description:
              "An optional string to provide additional details about the resize action.",
          },
          TargetEncryptionType: {
            type: "string",
            description:
              "The type of encryption for the cluster after the resize is complete.",
          },
          DataTransferProgressPercent: {
            type: "number",
            description:
              "The percent of data transferred from source cluster to target cluster.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default cancelResize;
