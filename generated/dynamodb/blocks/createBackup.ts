import { AppBlock, events } from "@slflows/sdk/v1";
import { DynamoDBClient, CreateBackupCommand } from "@aws-sdk/client-dynamodb";

const createBackup: AppBlock = {
  name: "Create Backup",
  description: "Creates a backup for an existing table.",
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
          description: "The name of the table.",
          type: "string",
          required: true,
        },
        BackupName: {
          name: "Backup Name",
          description: "Specified name for the backup.",
          type: "string",
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
        });

        const command = new CreateBackupCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Backup Result",
      description: "Result from CreateBackup operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          BackupDetails: {
            type: "object",
            properties: {
              BackupArn: {
                type: "string",
              },
              BackupName: {
                type: "string",
              },
              BackupSizeBytes: {
                type: "number",
              },
              BackupStatus: {
                type: "string",
              },
              BackupType: {
                type: "string",
              },
              BackupCreationDateTime: {
                type: "string",
              },
              BackupExpiryDateTime: {
                type: "string",
              },
            },
            required: [
              "BackupArn",
              "BackupName",
              "BackupStatus",
              "BackupType",
              "BackupCreationDateTime",
            ],
            additionalProperties: false,
            description:
              "Contains the details of the backup created for the table.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createBackup;
