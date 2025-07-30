import { AppBlock, events } from "@slflows/sdk/v1";
import {
  DynamoDBClient,
  ListGlobalTablesCommand,
} from "@aws-sdk/client-dynamodb";

const listGlobalTables: AppBlock = {
  name: "List Global Tables",
  description:
    "Lists all global tables that have a replica in the specified Region.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ExclusiveStartGlobalTableName: {
          name: "Exclusive Start Global Table Name",
          description:
            "The first global table name that this operation will evaluate.",
          type: "string",
          required: false,
        },
        Limit: {
          name: "Limit",
          description:
            "The maximum number of table names to return, if the parameter is not specified DynamoDB defaults to 100.",
          type: "number",
          required: false,
        },
        RegionName: {
          name: "Region Name",
          description: "Lists the global tables in a specific Region.",
          type: "string",
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

        const command = new ListGlobalTablesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Global Tables Result",
      description: "Result from ListGlobalTables operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          GlobalTables: {
            type: "array",
            items: {
              type: "object",
              properties: {
                GlobalTableName: {
                  type: "string",
                },
                ReplicationGroup: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      RegionName: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
              },
              additionalProperties: false,
            },
            description: "List of global table names.",
          },
          LastEvaluatedGlobalTableName: {
            type: "string",
            description: "Last evaluated global table name.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listGlobalTables;
