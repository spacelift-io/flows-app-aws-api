import { AppBlock, events } from "@slflows/sdk/v1";
import { RDSClient, DescribeExportTasksCommand } from "@aws-sdk/client-rds";

const describeExportTasks: AppBlock = {
  name: "Describe Export Tasks",
  description:
    "Returns information about a snapshot or cluster export to Amazon S3.",
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
            "The identifier of the snapshot or cluster export task to be described.",
          type: "string",
          required: false,
        },
        SourceArn: {
          name: "Source Arn",
          description:
            "The Amazon Resource Name (ARN) of the snapshot or cluster exported to Amazon S3.",
          type: "string",
          required: false,
        },
        Filters: {
          name: "Filters",
          description:
            "Filters specify one or more snapshot or cluster exports to describe.",
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
        Marker: {
          name: "Marker",
          description:
            "An optional pagination token provided by a previous DescribeExportTasks request.",
          type: "string",
          required: false,
        },
        MaxRecords: {
          name: "Max Records",
          description:
            "The maximum number of records to include in the response.",
          type: "number",
          required: false,
        },
        SourceType: {
          name: "Source Type",
          description: "The type of source for the export.",
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
        });

        const command = new DescribeExportTasksCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Export Tasks Result",
      description: "Result from DescribeExportTasks operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Marker: {
            type: "string",
            description:
              "A pagination token that can be used in a later DescribeExportTasks request.",
          },
          ExportTasks: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ExportTaskIdentifier: {
                  type: "string",
                },
                SourceArn: {
                  type: "string",
                },
                ExportOnly: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                SnapshotTime: {
                  type: "string",
                },
                TaskStartTime: {
                  type: "string",
                },
                TaskEndTime: {
                  type: "string",
                },
                S3Bucket: {
                  type: "string",
                },
                S3Prefix: {
                  type: "string",
                },
                IamRoleArn: {
                  type: "string",
                },
                KmsKeyId: {
                  type: "string",
                },
                Status: {
                  type: "string",
                },
                PercentProgress: {
                  type: "number",
                },
                TotalExtractedDataInGB: {
                  type: "number",
                },
                FailureCause: {
                  type: "string",
                },
                WarningMessage: {
                  type: "string",
                },
                SourceType: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "Information about an export of a snapshot or cluster to Amazon S3.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeExportTasks;
