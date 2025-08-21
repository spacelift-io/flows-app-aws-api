import { AppBlock, events } from "@slflows/sdk/v1";
import {
  DynamoDBClient,
  BatchExecuteStatementCommand,
} from "@aws-sdk/client-dynamodb";

const batchExecuteStatement: AppBlock = {
  name: "Batch Execute Statement",
  description:
    "This operation allows you to perform batch reads or writes on data stored in DynamoDB, using PartiQL.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Statements: {
          name: "Statements",
          description:
            "The list of PartiQL statements representing the batch to run.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Statement: {
                  type: "string",
                },
                Parameters: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                ConsistentRead: {
                  type: "boolean",
                },
                ReturnValuesOnConditionCheckFailure: {
                  type: "string",
                },
              },
              required: ["Statement"],
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

        const command = new BatchExecuteStatementCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Batch Execute Statement Result",
      description: "Result from BatchExecuteStatement operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Responses: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Error: {
                  type: "object",
                  properties: {
                    Code: {
                      type: "string",
                    },
                    Message: {
                      type: "string",
                    },
                    Item: {
                      type: "object",
                      additionalProperties: {
                        type: "object",
                      },
                    },
                  },
                  additionalProperties: false,
                },
                TableName: {
                  type: "string",
                },
                Item: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                },
              },
              additionalProperties: false,
            },
            description: "The response to each PartiQL statement in the batch.",
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
            description: "The capacity units consumed by the entire operation.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default batchExecuteStatement;
