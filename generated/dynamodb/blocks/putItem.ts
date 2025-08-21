import { AppBlock, events } from "@slflows/sdk/v1";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const putItem: AppBlock = {
  name: "Put Item",
  description: "Creates a new item, or replaces an old item with a new item.",
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
          description: "The name of the table to contain the item.",
          type: "string",
          required: true,
        },
        Item: {
          name: "Item",
          description:
            "A map of attribute name/value pairs, one for each attribute.",
          type: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
          },
          required: true,
        },
        Expected: {
          name: "Expected",
          description: "This is a legacy parameter.",
          type: {
            type: "object",
            additionalProperties: {
              type: "object",
            },
          },
          required: false,
        },
        ReturnValues: {
          name: "Return Values",
          description:
            "Use ReturnValues if you want to get the item attributes as they appeared before they were updated with the PutItem request.",
          type: "string",
          required: false,
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
        ConditionalOperator: {
          name: "Conditional Operator",
          description: "This is a legacy parameter.",
          type: "string",
          required: false,
        },
        ConditionExpression: {
          name: "Condition Expression",
          description:
            "A condition that must be satisfied in order for a conditional PutItem operation to succeed.",
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
        ExpressionAttributeValues: {
          name: "Expression Attribute Values",
          description:
            "One or more values that can be substituted in an expression.",
          type: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
          },
          required: false,
        },
        ReturnValuesOnConditionCheckFailure: {
          name: "Return Values On Condition Check Failure",
          description:
            "An optional parameter that returns the item attributes for a PutItem operation that failed a condition check.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new PutItemCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put Item Result",
      description: "Result from PutItem operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Attributes: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "The attribute values as they appeared before the PutItem operation, but only if ReturnValues is specified as ALL_OLD in the request.",
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
              "The capacity units consumed by the PutItem operation.",
          },
          ItemCollectionMetrics: {
            type: "object",
            properties: {
              ItemCollectionKey: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
              },
              SizeEstimateRangeGB: {
                type: "array",
                items: {
                  type: "number",
                },
              },
            },
            additionalProperties: false,
            description:
              "Information about item collections, if any, that were affected by the PutItem operation.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default putItem;
