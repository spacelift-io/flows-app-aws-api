import { AppBlock, events } from "@slflows/sdk/v1";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";

const getItem: AppBlock = {
  name: "Get Item",
  description:
    "The GetItem operation returns a set of attributes for the item with the given primary key.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        TableName: {
          name: "Table Name",
          description: "The name of the table containing the requested item.",
          type: "string",
          required: true,
        },
        Key: {
          name: "Key",
          description:
            "A map of attribute names to AttributeValue objects, representing the primary key of the item to retrieve.",
          type: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
          },
          required: true,
        },
        AttributesToGet: {
          name: "Attributes To Get",
          description: "This is a legacy parameter.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        ConsistentRead: {
          name: "Consistent Read",
          description:
            "Determines the read consistency model: If set to true, then the operation uses strongly consistent reads; otherwise, the operation uses eventually consistent reads.",
          type: "boolean",
          required: false,
        },
        ReturnConsumedCapacity: {
          name: "Return Consumed Capacity",
          description:
            "Determines the level of detail about either provisioned or on-demand throughput consumption that is returned in the response: INDEXES - The response includes the aggregate ConsumedCapacity for the operation, together with ConsumedCapacity for each table and secondary index that was accessed.",
          type: "string",
          required: false,
        },
        ProjectionExpression: {
          name: "Projection Expression",
          description:
            "A string that identifies one or more attributes to retrieve from the table.",
          type: "string",
          required: false,
        },
        ExpressionAttributeNames: {
          name: "Expression Attribute Names",
          description:
            "One or more substitution tokens for attribute names in an expression.",
          type: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
          },
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new GetItemCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Item Result",
      description: "Result from GetItem operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Item: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "A map of attribute names to AttributeValue objects, as specified by ProjectionExpression.",
          },
          ConsumedCapacity: {
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
            description:
              "The capacity units consumed by the GetItem operation.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getItem;
