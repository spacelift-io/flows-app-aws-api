import { AppBlock, events } from "@slflows/sdk/v1";
import {
  DynamoDBClient,
  TransactGetItemsCommand,
} from "@aws-sdk/client-dynamodb";

const transactGetItems: AppBlock = {
  name: "Transact Get Items",
  description:
    "TransactGetItems is a synchronous operation that atomically retrieves multiple items from one or more tables (but not from indexes) in a single account and Region.",
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
            "An ordered array of up to 100 TransactGetItem objects, each of which contains a Get structure.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Get: {
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
                    ProjectionExpression: {
                      type: "string",
                    },
                    ExpressionAttributeNames: {
                      type: "object",
                      additionalProperties: {
                        type: "object",
                      },
                    },
                  },
                  required: ["Key", "TableName"],
                  additionalProperties: false,
                },
              },
              required: ["Get"],
              additionalProperties: false,
            },
          },
          required: true,
        },
        ReturnConsumedCapacity: {
          name: "Return Consumed Capacity",
          description:
            "A value of TOTAL causes consumed capacity information to be returned, and a value of NONE prevents that information from being returned.",
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

        const command = new TransactGetItemsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Transact Get Items Result",
      description: "Result from TransactGetItems operation",
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
              "If the ReturnConsumedCapacity value was TOTAL, this is an array of ConsumedCapacity objects, one for each table addressed by TransactGetItem objects in the TransactItems parameter.",
          },
          Responses: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Item: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                },
              },
              additionalProperties: false,
            },
            description:
              "An ordered array of up to 100 ItemResponse objects, each of which corresponds to the TransactGetItem object in the same position in the TransactItems array.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default transactGetItems;
