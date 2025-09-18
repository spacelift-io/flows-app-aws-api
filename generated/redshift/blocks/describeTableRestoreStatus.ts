import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  DescribeTableRestoreStatusCommand,
} from "@aws-sdk/client-redshift";

const describeTableRestoreStatus: AppBlock = {
  name: "Describe Table Restore Status",
  description: `Lists the status of one or more table restore requests made using the RestoreTableFromClusterSnapshot API action.`,
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
            "The Amazon Redshift cluster that the table is being restored to.",
          type: "string",
          required: false,
        },
        TableRestoreRequestId: {
          name: "Table Restore Request Id",
          description:
            "The identifier of the table restore request to return status for.",
          type: "string",
          required: false,
        },
        MaxRecords: {
          name: "Max Records",
          description:
            "The maximum number of records to include in the response.",
          type: "number",
          required: false,
        },
        Marker: {
          name: "Marker",
          description:
            "An optional pagination token provided by a previous DescribeTableRestoreStatus request.",
          type: "string",
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

        const command = new DescribeTableRestoreStatusCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Table Restore Status Result",
      description: "Result from DescribeTableRestoreStatus operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          TableRestoreStatusDetails: {
            type: "array",
            items: {
              type: "object",
              properties: {
                TableRestoreRequestId: {
                  type: "string",
                },
                Status: {
                  type: "string",
                },
                Message: {
                  type: "string",
                },
                RequestTime: {
                  type: "string",
                },
                ProgressInMegaBytes: {
                  type: "number",
                },
                TotalDataInMegaBytes: {
                  type: "number",
                },
                ClusterIdentifier: {
                  type: "string",
                },
                SnapshotIdentifier: {
                  type: "string",
                },
                SourceDatabaseName: {
                  type: "string",
                },
                SourceSchemaName: {
                  type: "string",
                },
                SourceTableName: {
                  type: "string",
                },
                TargetDatabaseName: {
                  type: "string",
                },
                TargetSchemaName: {
                  type: "string",
                },
                NewTableName: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "A list of status details for one or more table restore requests.",
          },
          Marker: {
            type: "string",
            description:
              "A pagination token that can be used in a subsequent DescribeTableRestoreStatus request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeTableRestoreStatus;
