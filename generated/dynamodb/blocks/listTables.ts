import { AppBlock, events } from "@slflows/sdk/v1";
import { DynamoDBClient, ListTablesCommand } from "@aws-sdk/client-dynamodb";

const listTables: AppBlock = {
  name: "List Tables",
  description:
    "Returns an array of table names associated with the current account and endpoint.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ExclusiveStartTableName: {
          name: "Exclusive Start Table Name",
          description:
            "The first table name that this operation will evaluate.",
          type: "string",
          required: false,
        },
        Limit: {
          name: "Limit",
          description: "A maximum number of table names to return.",
          type: "number",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new DynamoDBClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
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
          TableNames: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "The names of the tables associated with the current account at the current endpoint.",
          },
          LastEvaluatedTableName: {
            type: "string",
            description:
              "The name of the last table in the current page of results.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listTables;
