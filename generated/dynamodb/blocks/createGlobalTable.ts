import { AppBlock, events } from "@slflows/sdk/v1";
import {
  DynamoDBClient,
  CreateGlobalTableCommand,
} from "@aws-sdk/client-dynamodb";

const createGlobalTable: AppBlock = {
  name: "Create Global Table",
  description: "Creates a global table from an existing table.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        GlobalTableName: {
          name: "Global Table Name",
          description: "The global table name.",
          type: "string",
          required: true,
        },
        ReplicationGroup: {
          name: "Replication Group",
          description:
            "The Regions where the global table needs to be created.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                RegionName: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
          },
          required: true,
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

        const command = new CreateGlobalTableCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Global Table Result",
      description: "Result from CreateGlobalTable operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          GlobalTableDescription: {
            type: "object",
            properties: {
              ReplicationGroup: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    RegionName: {
                      type: "string",
                    },
                    ReplicaStatus: {
                      type: "string",
                    },
                    ReplicaStatusDescription: {
                      type: "string",
                    },
                    ReplicaStatusPercentProgress: {
                      type: "string",
                    },
                    KMSMasterKeyId: {
                      type: "string",
                    },
                    ProvisionedThroughputOverride: {
                      type: "object",
                      properties: {
                        ReadCapacityUnits: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                    OnDemandThroughputOverride: {
                      type: "object",
                      properties: {
                        MaxReadRequestUnits: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                    WarmThroughput: {
                      type: "object",
                      properties: {
                        ReadUnitsPerSecond: {
                          type: "object",
                          additionalProperties: true,
                        },
                        WriteUnitsPerSecond: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Status: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                    GlobalSecondaryIndexes: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    ReplicaInaccessibleDateTime: {
                      type: "string",
                    },
                    ReplicaTableClassSummary: {
                      type: "object",
                      properties: {
                        TableClass: {
                          type: "object",
                          additionalProperties: true,
                        },
                        LastUpdateDateTime: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                  },
                  additionalProperties: false,
                },
              },
              GlobalTableArn: {
                type: "string",
              },
              CreationDateTime: {
                type: "string",
              },
              GlobalTableStatus: {
                type: "string",
              },
              GlobalTableName: {
                type: "string",
              },
            },
            additionalProperties: false,
            description: "Contains the details of the global table.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createGlobalTable;
