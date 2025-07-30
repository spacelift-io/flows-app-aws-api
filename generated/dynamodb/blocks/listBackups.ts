import { AppBlock, events } from "@slflows/sdk/v1";
import { DynamoDBClient, ListBackupsCommand } from "@aws-sdk/client-dynamodb";

const listBackups: AppBlock = {
  name: "List Backups",
  description:
    "List DynamoDB backups that are associated with an Amazon Web Services account and weren't made with Amazon Web Services Backup.",
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
          description:
            "Lists the backups from the table specified in TableName.",
          type: "string",
          required: false,
        },
        Limit: {
          name: "Limit",
          description: "Maximum number of backups to return at once.",
          type: "number",
          required: false,
        },
        TimeRangeLowerBound: {
          name: "Time Range Lower Bound",
          description: "Only backups created after this time are listed.",
          type: "string",
          required: false,
        },
        TimeRangeUpperBound: {
          name: "Time Range Upper Bound",
          description: "Only backups created before this time are listed.",
          type: "string",
          required: false,
        },
        ExclusiveStartBackupArn: {
          name: "Exclusive Start Backup Arn",
          description:
            "LastEvaluatedBackupArn is the Amazon Resource Name (ARN) of the backup last evaluated when the current page of results was returned, inclusive of the current page of results.",
          type: "string",
          required: false,
        },
        BackupType: {
          name: "Backup Type",
          description:
            "The backups from the table specified by BackupType are listed.",
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

        const command = new ListBackupsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Backups Result",
      description: "Result from ListBackups operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          BackupSummaries: {
            type: "array",
            items: {
              type: "object",
              properties: {
                TableName: {
                  type: "string",
                },
                TableId: {
                  type: "string",
                },
                TableArn: {
                  type: "string",
                },
                BackupArn: {
                  type: "string",
                },
                BackupName: {
                  type: "string",
                },
                BackupCreationDateTime: {
                  type: "string",
                },
                BackupExpiryDateTime: {
                  type: "string",
                },
                BackupStatus: {
                  type: "string",
                },
                BackupType: {
                  type: "string",
                },
                BackupSizeBytes: {
                  type: "number",
                },
              },
              additionalProperties: false,
            },
            description: "List of BackupSummary objects.",
          },
          LastEvaluatedBackupArn: {
            type: "string",
            description:
              "The ARN of the backup last evaluated when the current page of results was returned, inclusive of the current page of results.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listBackups;
