import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftDataClient,
  ListTablesCommand,
} from "@aws-sdk/client-redshift-data";

const listTables: AppBlock = {
  name: "List Tables",
  description: `List the tables in a database.`,
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
            "The name of the database that contains the tables to list.",
          type: "string",
          required: true,
        },
        ConnectedDatabase: {
          name: "Connected Database",
          description: "A database name.",
          type: "string",
          required: false,
        },
        SchemaPattern: {
          name: "Schema Pattern",
          description: "A pattern to filter results by schema name.",
          type: "string",
          required: false,
        },
        TablePattern: {
          name: "Table Pattern",
          description: "A pattern to filter results by table name.",
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

        const command = new ListTablesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Tables Result",
      description: "Result from ListTables operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Tables: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                },
                type: {
                  type: "string",
                },
                schema: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "The tables that match the request pattern.",
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

export default listTables;
