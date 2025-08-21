import { AppBlock, events } from "@slflows/sdk/v1";
import {
  DynamoDBClient,
  DescribeContinuousBackupsCommand,
} from "@aws-sdk/client-dynamodb";

const describeContinuousBackups: AppBlock = {
  name: "Describe Continuous Backups",
  description:
    "Checks the status of continuous backups and point in time recovery on the specified table.",
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
            "Name of the table for which the customer wants to check the continuous backups and point in time recovery settings.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new DescribeContinuousBackupsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Continuous Backups Result",
      description: "Result from DescribeContinuousBackups operation",
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

export default describeContinuousBackups;
