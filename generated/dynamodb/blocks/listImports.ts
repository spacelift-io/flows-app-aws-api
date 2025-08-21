import { AppBlock, events } from "@slflows/sdk/v1";
import { DynamoDBClient, ListImportsCommand } from "@aws-sdk/client-dynamodb";

const listImports: AppBlock = {
  name: "List Imports",
  description: "Lists completed imports within the past 90 days.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        TableArn: {
          name: "Table Arn",
          description:
            "The Amazon Resource Name (ARN) associated with the table that was imported to.",
          type: "string",
          required: false,
        },
        PageSize: {
          name: "Page Size",
          description:
            "The number of ImportSummary objects returned in a single page.",
          type: "number",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description:
            "An optional string that, if supplied, must be copied from the output of a previous call to ListImports.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new ListImportsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Imports Result",
      description: "Result from ListImports operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ImportSummaryList: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ImportArn: {
                  type: "string",
                },
                ImportStatus: {
                  type: "string",
                },
                TableArn: {
                  type: "string",
                },
                S3BucketSource: {
                  type: "object",
                  properties: {
                    S3BucketOwner: {
                      type: "string",
                    },
                    S3Bucket: {
                      type: "string",
                    },
                    S3KeyPrefix: {
                      type: "string",
                    },
                  },
                  required: ["S3Bucket"],
                  additionalProperties: false,
                },
                CloudWatchLogGroupArn: {
                  type: "string",
                },
                InputFormat: {
                  type: "string",
                },
                StartTime: {
                  type: "string",
                },
                EndTime: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "A list of ImportSummary objects.",
          },
          NextToken: {
            type: "string",
            description:
              "If this value is returned, there are additional results to be displayed.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listImports;
