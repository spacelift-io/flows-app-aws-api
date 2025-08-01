import { AppBlock, events } from "@slflows/sdk/v1";
import { RDSClient, CancelExportTaskCommand } from "@aws-sdk/client-rds";

const cancelExportTask: AppBlock = {
  name: "Cancel Export Task",
  description:
    "Cancels an export task in progress that is exporting a snapshot or cluster to Amazon S3.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ExportTaskIdentifier: {
          name: "Export Task Identifier",
          description:
            "The identifier of the snapshot or cluster export task to cancel.",
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

        const command = new CancelExportTaskCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Cancel Export Task Result",
      description: "Result from CancelExportTask operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ExportTaskIdentifier: {
            type: "string",
            description:
              "A unique identifier for the snapshot or cluster export task.",
          },
          SourceArn: {
            type: "string",
            description:
              "The Amazon Resource Name (ARN) of the snapshot or cluster exported to Amazon S3.",
          },
          ExportOnly: {
            type: "array",
            items: {
              type: "string",
            },
            description: "The data exported from the snapshot or cluster.",
          },
          SnapshotTime: {
            type: "string",
            description: "The time when the snapshot was created.",
          },
          TaskStartTime: {
            type: "string",
            description:
              "The time when the snapshot or cluster export task started.",
          },
          TaskEndTime: {
            type: "string",
            description:
              "The time when the snapshot or cluster export task ended.",
          },
          S3Bucket: {
            type: "string",
            description:
              "The Amazon S3 bucket where the snapshot or cluster is exported to.",
          },
          S3Prefix: {
            type: "string",
            description:
              "The Amazon S3 bucket prefix that is the file name and path of the exported data.",
          },
          IamRoleArn: {
            type: "string",
            description:
              "The name of the IAM role that is used to write to Amazon S3 when exporting a snapshot or cluster.",
          },
          KmsKeyId: {
            type: "string",
            description:
              "The key identifier of the Amazon Web Services KMS key that is used to encrypt the data when it's exported to Amazon S3.",
          },
          Status: {
            type: "string",
            description: "The progress status of the export task.",
          },
          PercentProgress: {
            type: "number",
            description:
              "The progress of the snapshot or cluster export task as a percentage.",
          },
          TotalExtractedDataInGB: {
            type: "number",
            description: "The total amount of data exported, in gigabytes.",
          },
          FailureCause: {
            type: "string",
            description: "The reason the export failed, if it failed.",
          },
          WarningMessage: {
            type: "string",
            description: "A warning about the snapshot or cluster export task.",
          },
          SourceType: {
            type: "string",
            description: "The type of source for the export.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default cancelExportTask;
