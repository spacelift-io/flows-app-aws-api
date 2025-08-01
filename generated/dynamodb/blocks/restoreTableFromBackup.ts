import { AppBlock, events } from "@slflows/sdk/v1";
import {
  DynamoDBClient,
  RestoreTableFromBackupCommand,
} from "@aws-sdk/client-dynamodb";

const restoreTableFromBackup: AppBlock = {
  name: "Restore Table From Backup",
  description: "Creates a new table from an existing backup.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        TargetTableName: {
          name: "Target Table Name",
          description:
            "The name of the new table to which the backup must be restored.",
          type: "string",
          required: true,
        },
        BackupArn: {
          name: "Backup Arn",
          description:
            "The Amazon Resource Name (ARN) associated with the backup.",
          type: "string",
          required: true,
        },
        BillingModeOverride: {
          name: "Billing Mode Override",
          description: "The billing mode of the restored table.",
          type: "string",
          required: false,
        },
        GlobalSecondaryIndexOverride: {
          name: "Global Secondary Index Override",
          description:
            "List of global secondary indexes for the restored table.",
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
        LocalSecondaryIndexOverride: {
          name: "Local Secondary Index Override",
          description:
            "List of local secondary indexes for the restored table.",
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
        ProvisionedThroughputOverride: {
          name: "Provisioned Throughput Override",
          description:
            "Provisioned throughput settings for the restored table.",
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
        OnDemandThroughputOverride: {
          name: "On Demand Throughput Override",
          description:
            "Sets the maximum number of read and write units for the specified on-demand table.",
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
        SSESpecificationOverride: {
          name: "SSE Specification Override",
          description:
            "The new server-side encryption settings for the restored table.",
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

        const command = new RestoreTableFromBackupCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Restore Table From Backup Result",
      description: "Result from RestoreTableFromBackup operation",
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
            description:
              "The description of the table created from an existing backup.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default restoreTableFromBackup;
