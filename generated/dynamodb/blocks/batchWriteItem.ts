import { AppBlock, events } from "@slflows/sdk/v1";
import {
  DynamoDBClient,
  BatchWriteItemCommand,
} from "@aws-sdk/client-dynamodb";

const batchWriteItem: AppBlock = {
  name: "Batch Write Item",
  description:
    "The BatchWriteItem operation puts or deletes multiple items in one or more tables.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        RequestItems: {
          name: "Request Items",
          description:
            "A map of one or more table names or table ARNs and, for each table, a list of operations to be performed (DeleteRequest or PutRequest).",
          type: {
            type: "object",
            additionalProperties: {
              type: "array",
            },
          },
          required: true,
        },
        ReturnConsumedCapacity: {
          name: "Return Consumed Capacity",
          description:
            "Determines the level of detail about either provisioned or on-demand throughput consumption that is returned in the response: INDEXES - The response includes the aggregate ConsumedCapacity for the operation, together with ConsumedCapacity for each table and secondary index that was accessed.",
          type: "string",
          required: false,
        },
        ReturnItemCollectionMetrics: {
          name: "Return Item Collection Metrics",
          description:
            "Determines whether item collection metrics are returned.",
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

        const command = new BatchWriteItemCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Batch Write Item Result",
      description: "Result from BatchWriteItem operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          UnprocessedItems: {
            type: "object",
            additionalProperties: {
              type: "array",
            },
            description:
              "A map of tables and requests against those tables that were not processed.",
          },
          ItemCollectionMetrics: {
            type: "object",
            additionalProperties: {
              type: "array",
            },
            description:
              "A list of tables that were processed by BatchWriteItem and, for each table, information about any item collections that were affected by individual DeleteItem or PutItem operations.",
          },
          ConsumedCapacity: {
            type: "array",
            items: {
              type: "object",
              properties: {
                TableName: {
                  type: "string",
                },
                CapacityUnits: {
                  type: "number",
                },
                ReadCapacityUnits: {
                  type: "number",
                },
                WriteCapacityUnits: {
                  type: "number",
                },
                Table: {
                  type: "object",
                  properties: {
                    ReadCapacityUnits: {
                      type: "number",
                    },
                    WriteCapacityUnits: {
                      type: "number",
                    },
                    CapacityUnits: {
                      type: "number",
                    },
                  },
                  additionalProperties: false,
                },
                LocalSecondaryIndexes: {
                  type: "object",
                  additionalProperties: {
                    type: "object",
                  },
                },
                GlobalSecondaryIndexes: {
                  type: "object",
                  additionalProperties: {
                    type: "object",
                  },
                },
              },
              additionalProperties: false,
            },
            description:
              "The capacity units consumed by the entire BatchWriteItem operation.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default batchWriteItem;
