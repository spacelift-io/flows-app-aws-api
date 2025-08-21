import { AppBlock, events } from "@slflows/sdk/v1";
import {
  DynamoDBClient,
  DescribeExportCommand,
} from "@aws-sdk/client-dynamodb";

const describeExport: AppBlock = {
  name: "Describe Export",
  description: "Describes an existing table export.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ExportArn: {
          name: "Export Arn",
          description:
            "The Amazon Resource Name (ARN) associated with the export.",
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

        const command = new DescribeExportCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Export Result",
      description: "Result from DescribeExport operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ExportDescription: {
            type: "object",
            properties: {
              ExportArn: {
                type: "string",
              },
              ExportStatus: {
                type: "string",
              },
              StartTime: {
                type: "string",
              },
              EndTime: {
                type: "string",
              },
              ExportManifest: {
                type: "string",
              },
              TableArn: {
                type: "string",
              },
              TableId: {
                type: "string",
              },
              ExportTime: {
                type: "string",
              },
              ClientToken: {
                type: "string",
              },
              S3Bucket: {
                type: "string",
              },
              S3BucketOwner: {
                type: "string",
              },
              S3Prefix: {
                type: "string",
              },
              S3SseAlgorithm: {
                type: "string",
              },
              S3SseKmsKeyId: {
                type: "string",
              },
              FailureCode: {
                type: "string",
              },
              FailureMessage: {
                type: "string",
              },
              ExportFormat: {
                type: "string",
              },
              BilledSizeBytes: {
                type: "number",
              },
              ItemCount: {
                type: "number",
              },
              ExportType: {
                type: "string",
              },
              IncrementalExportSpecification: {
                type: "object",
                properties: {
                  ExportFromTime: {
                    type: "string",
                  },
                  ExportToTime: {
                    type: "string",
                  },
                  ExportViewType: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
            },
            additionalProperties: false,
            description: "Represents the properties of the export.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeExport;
