import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RDSClient,
  DescribeDBInstanceAutomatedBackupsCommand,
} from "@aws-sdk/client-rds";

const describeDBInstanceAutomatedBackups: AppBlock = {
  name: "Describe DB Instance Automated Backups",
  description: "Displays backups for both current and deleted instances.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DbiResourceId: {
          name: "Dbi Resource Id",
          description:
            "The resource ID of the DB instance that is the source of the automated backup.",
          type: "string",
          required: false,
        },
        DBInstanceIdentifier: {
          name: "DB Instance Identifier",
          description: "(Optional) The user-supplied instance identifier.",
          type: "string",
          required: false,
        },
        Filters: {
          name: "Filters",
          description:
            "A filter that specifies which resources to return based on status.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Name: {
                  type: "string",
                },
                Values: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
              required: ["Name", "Values"],
              additionalProperties: false,
            },
          },
          required: false,
        },
        MaxRecords: {
          name: "Max Records",
          description:
            "The maximum number of records to include in the response.",
          type: "number",
          required: false,
        },
        Marker: {
          name: "Marker",
          description: "The pagination token provided in the previous request.",
          type: "string",
          required: false,
        },
        DBInstanceAutomatedBackupsArn: {
          name: "DB Instance Automated Backups Arn",
          description:
            "The Amazon Resource Name (ARN) of the replicated automated backups, for example, arn:aws:rds:us-east-1:123456789012:auto-backup:ab-L2IJCEXJP7XQ7HOJ4SIEXAMPLE.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new RDSClient({
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

        const command = new DescribeDBInstanceAutomatedBackupsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe DB Instance Automated Backups Result",
      description: "Result from DescribeDBInstanceAutomatedBackups operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Marker: {
            type: "string",
            description:
              "An optional pagination token provided by a previous request.",
          },
          DBInstanceAutomatedBackups: {
            type: "array",
            items: {
              type: "object",
              properties: {
                DBInstanceArn: {
                  type: "string",
                },
                DbiResourceId: {
                  type: "string",
                },
                Region: {
                  type: "string",
                },
                DBInstanceIdentifier: {
                  type: "string",
                },
                RestoreWindow: {
                  type: "object",
                  properties: {
                    EarliestTime: {
                      type: "string",
                    },
                    LatestTime: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
                AllocatedStorage: {
                  type: "number",
                },
                Status: {
                  type: "string",
                },
                Port: {
                  type: "number",
                },
                AvailabilityZone: {
                  type: "string",
                },
                VpcId: {
                  type: "string",
                },
                InstanceCreateTime: {
                  type: "string",
                },
                MasterUsername: {
                  type: "string",
                },
                Engine: {
                  type: "string",
                },
                EngineVersion: {
                  type: "string",
                },
                LicenseModel: {
                  type: "string",
                },
                Iops: {
                  type: "number",
                },
                OptionGroupName: {
                  type: "string",
                },
                TdeCredentialArn: {
                  type: "string",
                },
                Encrypted: {
                  type: "boolean",
                },
                StorageType: {
                  type: "string",
                },
                KmsKeyId: {
                  type: "string",
                },
                Timezone: {
                  type: "string",
                },
                IAMDatabaseAuthenticationEnabled: {
                  type: "boolean",
                },
                BackupRetentionPeriod: {
                  type: "number",
                },
                DBInstanceAutomatedBackupsArn: {
                  type: "string",
                },
                DBInstanceAutomatedBackupsReplications: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      DBInstanceAutomatedBackupsArn: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                BackupTarget: {
                  type: "string",
                },
                StorageThroughput: {
                  type: "number",
                },
                AwsBackupRecoveryPointArn: {
                  type: "string",
                },
                DedicatedLogVolume: {
                  type: "boolean",
                },
                MultiTenant: {
                  type: "boolean",
                },
              },
              additionalProperties: false,
            },
            description: "A list of DBInstanceAutomatedBackup instances.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeDBInstanceAutomatedBackups;
