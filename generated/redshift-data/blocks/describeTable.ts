import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftDataClient,
  DescribeTableCommand,
} from "@aws-sdk/client-redshift-data";

const describeTable: AppBlock = {
  name: "Describe Table",
  description: `Describes the detailed information about a table from metadata in the cluster.`,
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
          description: "The cluster identifier.",
          type: "string",
          required: false,
        },
        SecretArn: {
          name: "Secret Arn",
          description:
            "The name or ARN of the secret that enables access to the database.",
          type: "string",
          required: false,
        },
        DbUser: {
          name: "Db User",
          description: "The database user name.",
          type: "string",
          required: false,
        },
        Database: {
          name: "Database",
          description:
            "The name of the database that contains the tables to be described.",
          type: "string",
          required: true,
        },
        ConnectedDatabase: {
          name: "Connected Database",
          description: "A database name.",
          type: "string",
          required: false,
        },
        Schema: {
          name: "Schema",
          description: "The schema that contains the table.",
          type: "string",
          required: false,
        },
        Table: {
          name: "Table",
          description: "The table name.",
          type: "string",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description:
            "A value that indicates the starting point for the next set of response records in a subsequent request.",
          type: "string",
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description:
            "The maximum number of tables to return in the response.",
          type: "number",
          required: false,
        },
        WorkgroupName: {
          name: "Workgroup Name",
          description:
            "The serverless workgroup name or Amazon Resource Name (ARN).",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new RedshiftDataClient({
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

        const command = new DescribeTableCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Table Result",
      description: "Result from DescribeTable operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          TableName: {
            type: "string",
            description: "The table name.",
          },
          ColumnList: {
            type: "array",
            items: {
              type: "object",
              properties: {
                isCaseSensitive: {
                  type: "boolean",
                },
                isCurrency: {
                  type: "boolean",
                },
                isSigned: {
                  type: "boolean",
                },
                label: {
                  type: "string",
                },
                name: {
                  type: "string",
                },
                nullable: {
                  type: "number",
                },
                precision: {
                  type: "number",
                },
                scale: {
                  type: "number",
                },
                schemaName: {
                  type: "string",
                },
                tableName: {
                  type: "string",
                },
                typeName: {
                  type: "string",
                },
                length: {
                  type: "number",
                },
                columnDefault: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "A list of columns in the table.",
          },
          NextToken: {
            type: "string",
            description:
              "A value that indicates the starting point for the next set of response records in a subsequent request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeTable;
