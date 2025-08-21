import { AppBlock, events } from "@slflows/sdk/v1";
import { DynamoDBClient, CreateTableCommand } from "@aws-sdk/client-dynamodb";

const createTable: AppBlock = {
  name: "Create Table",
  description: "The CreateTable operation adds a new table to your account.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        AttributeDefinitions: {
          name: "Attribute Definitions",
          description:
            "An array of attributes that describe the key schema for the table and indexes.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                AttributeName: {
                  type: "string",
                },
                AttributeType: {
                  type: "string",
                },
              },
              required: ["AttributeName", "AttributeType"],
              additionalProperties: false,
            },
          },
          required: true,
        },
        TableName: {
          name: "Table Name",
          description: "The name of the table to create.",
          type: "string",
          required: true,
        },
        KeySchema: {
          name: "Key Schema",
          description:
            "Specifies the attributes that make up the primary key for a table or an index.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                AttributeName: {
                  type: "string",
                },
                KeyType: {
                  type: "string",
                },
              },
              required: ["AttributeName", "KeyType"],
              additionalProperties: false,
            },
          },
          required: true,
        },
        LocalSecondaryIndexes: {
          name: "Local Secondary Indexes",
          description:
            "One or more local secondary indexes (the maximum is 5) to be created on the table.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                IndexName: {
                  type: "string",
                },
                KeySchema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      AttributeName: {
                        type: "object",
                        additionalProperties: true,
                      },
                      KeyType: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    required: ["AttributeName", "KeyType"],
                    additionalProperties: false,
                  },
                },
                Projection: {
                  type: "object",
                  properties: {
                    ProjectionType: {
                      type: "string",
                    },
                    NonKeyAttributes: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                  },
                  additionalProperties: false,
                },
              },
              required: ["IndexName", "KeySchema", "Projection"],
              additionalProperties: false,
            },
          },
          required: false,
        },
        GlobalSecondaryIndexes: {
          name: "Global Secondary Indexes",
          description:
            "One or more global secondary indexes (the maximum is 20) to be created on the table.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                IndexName: {
                  type: "string",
                },
                KeySchema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      AttributeName: {
                        type: "object",
                        additionalProperties: true,
                      },
                      KeyType: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    required: ["AttributeName", "KeyType"],
                    additionalProperties: false,
                  },
                },
                Projection: {
                  type: "object",
                  properties: {
                    ProjectionType: {
                      type: "string",
                    },
                    NonKeyAttributes: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                  },
                  additionalProperties: false,
                },
                ProvisionedThroughput: {
                  type: "object",
                  properties: {
                    ReadCapacityUnits: {
                      type: "number",
                    },
                    WriteCapacityUnits: {
                      type: "number",
                    },
                  },
                  required: ["ReadCapacityUnits", "WriteCapacityUnits"],
                  additionalProperties: false,
                },
                OnDemandThroughput: {
                  type: "object",
                  properties: {
                    MaxReadRequestUnits: {
                      type: "number",
                    },
                    MaxWriteRequestUnits: {
                      type: "number",
                    },
                  },
                  additionalProperties: false,
                },
                WarmThroughput: {
                  type: "object",
                  properties: {
                    ReadUnitsPerSecond: {
                      type: "number",
                    },
                    WriteUnitsPerSecond: {
                      type: "number",
                    },
                  },
                  additionalProperties: false,
                },
              },
              required: ["IndexName", "KeySchema", "Projection"],
              additionalProperties: false,
            },
          },
          required: false,
        },
        BillingMode: {
          name: "Billing Mode",
          description:
            "Controls how you are charged for read and write throughput and how you manage capacity.",
          type: "string",
          required: false,
        },
        ProvisionedThroughput: {
          name: "Provisioned Throughput",
          description:
            "Represents the provisioned throughput settings for a specified table or index.",
          type: {
            type: "object",
            properties: {
              ReadCapacityUnits: {
                type: "number",
              },
              WriteCapacityUnits: {
                type: "number",
              },
            },
            required: ["ReadCapacityUnits", "WriteCapacityUnits"],
            additionalProperties: false,
          },
          required: false,
        },
        StreamSpecification: {
          name: "Stream Specification",
          description: "The settings for DynamoDB Streams on the table.",
          type: {
            type: "object",
            properties: {
              StreamEnabled: {
                type: "boolean",
              },
              StreamViewType: {
                type: "string",
              },
            },
            required: ["StreamEnabled"],
            additionalProperties: false,
          },
          required: false,
        },
        SSESpecification: {
          name: "SSE Specification",
          description:
            "Represents the settings used to enable server-side encryption.",
          type: {
            type: "object",
            properties: {
              Enabled: {
                type: "boolean",
              },
              SSEType: {
                type: "string",
              },
              KMSMasterKeyId: {
                type: "string",
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        Tags: {
          name: "Tags",
          description: "A list of key-value pairs to label the table.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Key: {
                  type: "string",
                },
                Value: {
                  type: "string",
                },
              },
              required: ["Key", "Value"],
              additionalProperties: false,
            },
          },
          required: false,
        },
        TableClass: {
          name: "Table Class",
          description: "The table class of the new table.",
          type: "string",
          required: false,
        },
        DeletionProtectionEnabled: {
          name: "Deletion Protection Enabled",
          description:
            "Indicates whether deletion protection is to be enabled (true) or disabled (false) on the table.",
          type: "boolean",
          required: false,
        },
        WarmThroughput: {
          name: "Warm Throughput",
          description:
            "Represents the warm throughput (in read units per second and write units per second) for creating a table.",
          type: {
            type: "object",
            properties: {
              ReadUnitsPerSecond: {
                type: "number",
              },
              WriteUnitsPerSecond: {
                type: "number",
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        ResourcePolicy: {
          name: "Resource Policy",
          description:
            "An Amazon Web Services resource-based policy document in JSON format that will be attached to the table.",
          type: "string",
          required: false,
        },
        OnDemandThroughput: {
          name: "On Demand Throughput",
          description:
            "Sets the maximum number of read and write units for the specified table in on-demand capacity mode.",
          type: {
            type: "object",
            properties: {
              MaxReadRequestUnits: {
                type: "number",
              },
              MaxWriteRequestUnits: {
                type: "number",
              },
            },
            additionalProperties: false,
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

        const command = new CreateTableCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Table Result",
      description: "Result from CreateTable operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          TableDescription: {
            type: "object",
            properties: {
              AttributeDefinitions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    AttributeName: {
                      type: "string",
                    },
                    AttributeType: {
                      type: "string",
                    },
                  },
                  required: ["AttributeName", "AttributeType"],
                  additionalProperties: false,
                },
              },
              TableName: {
                type: "string",
              },
              KeySchema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    AttributeName: {
                      type: "string",
                    },
                    KeyType: {
                      type: "string",
                    },
                  },
                  required: ["AttributeName", "KeyType"],
                  additionalProperties: false,
                },
              },
              TableStatus: {
                type: "string",
              },
              CreationDateTime: {
                type: "string",
              },
              ProvisionedThroughput: {
                type: "object",
                properties: {
                  LastIncreaseDateTime: {
                    type: "string",
                  },
                  LastDecreaseDateTime: {
                    type: "string",
                  },
                  NumberOfDecreasesToday: {
                    type: "number",
                  },
                  ReadCapacityUnits: {
                    type: "number",
                  },
                  WriteCapacityUnits: {
                    type: "number",
                  },
                },
                additionalProperties: false,
              },
              TableSizeBytes: {
                type: "number",
              },
              ItemCount: {
                type: "number",
              },
              TableArn: {
                type: "string",
              },
              TableId: {
                type: "string",
              },
              BillingModeSummary: {
                type: "object",
                properties: {
                  BillingMode: {
                    type: "string",
                  },
                  LastUpdateToPayPerRequestDateTime: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
              LocalSecondaryIndexes: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    IndexName: {
                      type: "string",
                    },
                    KeySchema: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    Projection: {
                      type: "object",
                      properties: {
                        ProjectionType: {
                          type: "object",
                          additionalProperties: true,
                        },
                        NonKeyAttributes: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                    IndexSizeBytes: {
                      type: "number",
                    },
                    ItemCount: {
                      type: "number",
                    },
                    IndexArn: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              GlobalSecondaryIndexes: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    IndexName: {
                      type: "string",
                    },
                    KeySchema: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    Projection: {
                      type: "object",
                      properties: {
                        ProjectionType: {
                          type: "object",
                          additionalProperties: true,
                        },
                        NonKeyAttributes: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                    IndexStatus: {
                      type: "string",
                    },
                    Backfilling: {
                      type: "boolean",
                    },
                    ProvisionedThroughput: {
                      type: "object",
                      properties: {
                        LastIncreaseDateTime: {
                          type: "object",
                          additionalProperties: true,
                        },
                        LastDecreaseDateTime: {
                          type: "object",
                          additionalProperties: true,
                        },
                        NumberOfDecreasesToday: {
                          type: "object",
                          additionalProperties: true,
                        },
                        ReadCapacityUnits: {
                          type: "object",
                          additionalProperties: true,
                        },
                        WriteCapacityUnits: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                    IndexSizeBytes: {
                      type: "number",
                    },
                    ItemCount: {
                      type: "number",
                    },
                    IndexArn: {
                      type: "string",
                    },
                    OnDemandThroughput: {
                      type: "object",
                      properties: {
                        MaxReadRequestUnits: {
                          type: "object",
                          additionalProperties: true,
                        },
                        MaxWriteRequestUnits: {
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
                  },
                  additionalProperties: false,
                },
              },
              StreamSpecification: {
                type: "object",
                properties: {
                  StreamEnabled: {
                    type: "boolean",
                  },
                  StreamViewType: {
                    type: "string",
                  },
                },
                required: ["StreamEnabled"],
                additionalProperties: false,
              },
              LatestStreamLabel: {
                type: "string",
              },
              LatestStreamArn: {
                type: "string",
              },
              GlobalTableVersion: {
                type: "string",
              },
              Replicas: {
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
              GlobalTableWitnesses: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    RegionName: {
                      type: "string",
                    },
                    WitnessStatus: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              RestoreSummary: {
                type: "object",
                properties: {
                  SourceBackupArn: {
                    type: "string",
                  },
                  SourceTableArn: {
                    type: "string",
                  },
                  RestoreDateTime: {
                    type: "string",
                  },
                  RestoreInProgress: {
                    type: "boolean",
                  },
                },
                required: ["RestoreDateTime", "RestoreInProgress"],
                additionalProperties: false,
              },
              SSEDescription: {
                type: "object",
                properties: {
                  Status: {
                    type: "string",
                  },
                  SSEType: {
                    type: "string",
                  },
                  KMSMasterKeyArn: {
                    type: "string",
                  },
                  InaccessibleEncryptionDateTime: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
              ArchivalSummary: {
                type: "object",
                properties: {
                  ArchivalDateTime: {
                    type: "string",
                  },
                  ArchivalReason: {
                    type: "string",
                  },
                  ArchivalBackupArn: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
              TableClassSummary: {
                type: "object",
                properties: {
                  TableClass: {
                    type: "string",
                  },
                  LastUpdateDateTime: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
              DeletionProtectionEnabled: {
                type: "boolean",
              },
              OnDemandThroughput: {
                type: "object",
                properties: {
                  MaxReadRequestUnits: {
                    type: "number",
                  },
                  MaxWriteRequestUnits: {
                    type: "number",
                  },
                },
                additionalProperties: false,
              },
              WarmThroughput: {
                type: "object",
                properties: {
                  ReadUnitsPerSecond: {
                    type: "number",
                  },
                  WriteUnitsPerSecond: {
                    type: "number",
                  },
                  Status: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
              MultiRegionConsistency: {
                type: "string",
              },
            },
            additionalProperties: false,
            description: "Represents the properties of the table.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createTable;
