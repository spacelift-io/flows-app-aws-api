import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RDSClient,
  StartDBInstanceAutomatedBackupsReplicationCommand,
} from "@aws-sdk/client-rds";

const startDBInstanceAutomatedBackupsReplication: AppBlock = {
  name: "Start DB Instance Automated Backups Replication",
  description:
    "Enables replication of automated backups to a different Amazon Web Services Region.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        SourceDBInstanceArn: {
          name: "Source DB Instance Arn",
          description:
            "The Amazon Resource Name (ARN) of the source DB instance for the replicated automated backups, for example, arn:aws:rds:us-west-2:123456789012:db:mydatabase.",
          type: "string",
          required: true,
        },
        BackupRetentionPeriod: {
          name: "Backup Retention Period",
          description:
            "The retention period for the replicated automated backups.",
          type: "number",
          required: false,
        },
        KmsKeyId: {
          name: "Kms Key Id",
          description:
            "The Amazon Web Services KMS key identifier for encryption of the replicated automated backups.",
          type: "string",
          required: false,
        },
        PreSignedUrl: {
          name: "Pre Signed Url",
          description:
            "In an Amazon Web Services GovCloud (US) Region, an URL that contains a Signature Version 4 signed request for the StartDBInstanceAutomatedBackupsReplication operation to call in the Amazon Web Services Region of the source DB instance.",
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

        const command = new StartDBInstanceAutomatedBackupsReplicationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Start DB Instance Automated Backups Replication Result",
      description:
        "Result from StartDBInstanceAutomatedBackupsReplication operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          DBInstanceAutomatedBackup: {
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
                      type: "string",
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
            description: "An automated backup of a DB instance.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default startDBInstanceAutomatedBackupsReplication;
