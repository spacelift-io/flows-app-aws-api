import { AppBlock, events } from "@slflows/sdk/v1";
import {
  DynamoDBClient,
  UpdateContinuousBackupsCommand,
} from "@aws-sdk/client-dynamodb";

const updateContinuousBackups: AppBlock = {
  name: "Update Continuous Backups",
  description:
    "UpdateContinuousBackups enables or disables point in time recovery for the specified table.",
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
        PointInTimeRecoverySpecification: {
          name: "Point In Time Recovery Specification",
          description:
            "Represents the settings used to enable point in time recovery.",
          type: {
            type: "object",
            properties: {
              PointInTimeRecoveryEnabled: {
                type: "boolean",
              },
              RecoveryPeriodInDays: {
                type: "number",
              },
            },
            required: ["PointInTimeRecoveryEnabled"],
            additionalProperties: false,
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
        });

        const command = new UpdateContinuousBackupsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Continuous Backups Result",
      description: "Result from UpdateContinuousBackups operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ContinuousBackupsDescription: {
            type: "object",
            properties: {
              ContinuousBackupsStatus: {
                type: "string",
              },
              PointInTimeRecoveryDescription: {
                type: "object",
                properties: {
                  PointInTimeRecoveryStatus: {
                    type: "string",
                  },
                  RecoveryPeriodInDays: {
                    type: "number",
                  },
                  EarliestRestorableDateTime: {
                    type: "string",
                  },
                  LatestRestorableDateTime: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
            },
            required: ["ContinuousBackupsStatus"],
            additionalProperties: false,
            description:
              "Represents the continuous backups and point in time recovery settings on the table.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default updateContinuousBackups;
