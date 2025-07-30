import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RDSClient,
  DeleteDBClusterAutomatedBackupCommand,
} from "@aws-sdk/client-rds";

const deleteDBClusterAutomatedBackup: AppBlock = {
  name: "Delete DB Cluster Automated Backup",
  description:
    "Deletes automated backups using the DbClusterResourceId value of the source DB cluster or the Amazon Resource Name (ARN) of the automated backups.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DbClusterResourceId: {
          name: "Db Cluster Resource Id",
          description:
            "The identifier for the source DB cluster, which can't be changed and which is unique to an Amazon Web Services Region.",
          type: "string",
          required: true,
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
        });

        const command = new DeleteDBClusterAutomatedBackupCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete DB Cluster Automated Backup Result",
      description: "Result from DeleteDBClusterAutomatedBackup operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          DBClusterAutomatedBackup: {
            type: "object",
            properties: {
              Engine: {
                type: "string",
              },
              VpcId: {
                type: "string",
              },
              DBClusterAutomatedBackupsArn: {
                type: "string",
              },
              DBClusterIdentifier: {
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
              MasterUsername: {
                type: "string",
              },
              DbClusterResourceId: {
                type: "string",
              },
              Region: {
                type: "string",
              },
              LicenseModel: {
                type: "string",
              },
              Status: {
                type: "string",
              },
              IAMDatabaseAuthenticationEnabled: {
                type: "boolean",
              },
              ClusterCreateTime: {
                type: "string",
              },
              StorageEncrypted: {
                type: "boolean",
              },
              AllocatedStorage: {
                type: "number",
              },
              EngineVersion: {
                type: "string",
              },
              DBClusterArn: {
                type: "string",
              },
              BackupRetentionPeriod: {
                type: "number",
              },
              EngineMode: {
                type: "string",
              },
              AvailabilityZones: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              Port: {
                type: "number",
              },
              KmsKeyId: {
                type: "string",
              },
              StorageType: {
                type: "string",
              },
              Iops: {
                type: "number",
              },
              AwsBackupRecoveryPointArn: {
                type: "string",
              },
              StorageThroughput: {
                type: "number",
              },
            },
            additionalProperties: false,
            description: "An automated backup of a DB cluster.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deleteDBClusterAutomatedBackup;
