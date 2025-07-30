import { AppBlock, events } from "@slflows/sdk/v1";
import {
  DynamoDBClient,
  ExecuteTransactionCommand,
} from "@aws-sdk/client-dynamodb";

const executeTransaction: AppBlock = {
  name: "Execute Transaction",
  description:
    "This operation allows you to perform transactional reads or writes on data stored in DynamoDB, using PartiQL.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        TransactStatements: {
          name: "Transact Statements",
          description:
            "The list of PartiQL statements representing the transaction to run.",
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
        ClientRequestToken: {
          name: "Client Request Token",
          description:
            "Set this value to get remaining results, if NextToken was returned in the statement response.",
          type: "string",
          required: false,
        },
        ReturnConsumedCapacity: {
          name: "Return Consumed Capacity",
          description:
            "Determines the level of detail about either provisioned or on-demand throughput consumption that is returned in the response.",
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

        const command = new ExecuteTransactionCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Execute Transaction Result",
      description: "Result from ExecuteTransaction operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
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
            description: "The response to a PartiQL transaction.",
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

export default executeTransaction;
