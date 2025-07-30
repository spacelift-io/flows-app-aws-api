import { AppBlock, events } from "@slflows/sdk/v1";
import {
  DynamoDBClient,
  TransactWriteItemsCommand,
} from "@aws-sdk/client-dynamodb";

const transactWriteItems: AppBlock = {
  name: "Transact Write Items",
  description:
    "TransactWriteItems is a synchronous write operation that groups up to 100 action requests.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        TransactItems: {
          name: "Transact Items",
          description:
            "An ordered array of up to 100 TransactWriteItem objects, each of which contains a ConditionCheck, Put, Update, or Delete object.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ConditionCheck: {
                  type: "object",
                  properties: {
                    Key: {
                      type: "object",
                      additionalProperties: {
                        type: "object",
                      },
                    },
                    TableName: {
                      type: "string",
                    },
                    ConditionExpression: {
                      type: "string",
                    },
                    ExpressionAttributeNames: {
                      type: "object",
                      additionalProperties: {
                        type: "object",
                      },
                    },
                    ExpressionAttributeValues: {
                      type: "object",
                      additionalProperties: {
                        type: "object",
                      },
                    },
                    ReturnValuesOnConditionCheckFailure: {
                      type: "string",
                    },
                  },
                  required: ["Key", "TableName", "ConditionExpression"],
                  additionalProperties: false,
                },
                Put: {
                  type: "object",
                  properties: {
                    Item: {
                      type: "object",
                      additionalProperties: {
                        type: "object",
                      },
                    },
                    TableName: {
                      type: "string",
                    },
                    ConditionExpression: {
                      type: "string",
                    },
                    ExpressionAttributeNames: {
                      type: "object",
                      additionalProperties: {
                        type: "object",
                      },
                    },
                    ExpressionAttributeValues: {
                      type: "object",
                      additionalProperties: {
                        type: "object",
                      },
                    },
                    ReturnValuesOnConditionCheckFailure: {
                      type: "string",
                    },
                  },
                  required: ["Item", "TableName"],
                  additionalProperties: false,
                },
                Delete: {
                  type: "object",
                  properties: {
                    Key: {
                      type: "object",
                      additionalProperties: {
                        type: "object",
                      },
                    },
                    TableName: {
                      type: "string",
                    },
                    ConditionExpression: {
                      type: "string",
                    },
                    ExpressionAttributeNames: {
                      type: "object",
                      additionalProperties: {
                        type: "object",
                      },
                    },
                    ExpressionAttributeValues: {
                      type: "object",
                      additionalProperties: {
                        type: "object",
                      },
                    },
                    ReturnValuesOnConditionCheckFailure: {
                      type: "string",
                    },
                  },
                  required: ["Key", "TableName"],
                  additionalProperties: false,
                },
                Update: {
                  type: "object",
                  properties: {
                    Key: {
                      type: "object",
                      additionalProperties: {
                        type: "object",
                      },
                    },
                    UpdateExpression: {
                      type: "string",
                    },
                    TableName: {
                      type: "string",
                    },
                    ConditionExpression: {
                      type: "string",
                    },
                    ExpressionAttributeNames: {
                      type: "object",
                      additionalProperties: {
                        type: "object",
                      },
                    },
                    ExpressionAttributeValues: {
                      type: "object",
                      additionalProperties: {
                        type: "object",
                      },
                    },
                    ReturnValuesOnConditionCheckFailure: {
                      type: "string",
                    },
                  },
                  required: ["Key", "UpdateExpression", "TableName"],
                  additionalProperties: false,
                },
              },
              additionalProperties: false,
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
        ClientRequestToken: {
          name: "Client Request Token",
          description:
            "Providing a ClientRequestToken makes the call to TransactWriteItems idempotent, meaning that multiple identical calls have the same effect as one single call.",
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

        const command = new TransactWriteItemsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Transact Write Items Result",
      description: "Result from TransactWriteItems operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
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
              "The capacity units consumed by the entire TransactWriteItems operation.",
          },
          ItemCollectionMetrics: {
            type: "object",
            additionalProperties: {
              type: "array",
            },
            description:
              "A list of tables that were processed by TransactWriteItems and, for each table, information about any item collections that were affected by individual UpdateItem, PutItem, or DeleteItem operations.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default transactWriteItems;
