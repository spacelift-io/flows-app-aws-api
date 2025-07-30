import { AppBlock, events } from "@slflows/sdk/v1";
import {
  S3Client,
  ListBucketAnalyticsConfigurationsCommand,
} from "@aws-sdk/client-s3";

const listBucketAnalyticsConfigurations: AppBlock = {
  name: "List Bucket Analytics Configurations",
  description: "This operation is not supported for directory buckets.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Bucket: {
          name: "Bucket",
          description:
            "The name of the bucket from which analytics configurations are retrieved.",
          type: "string",
          required: true,
        },
        ContinuationToken: {
          name: "Continuation Token",
          description:
            "The ContinuationToken that represents a placeholder from where this request should begin.",
          type: "string",
          required: false,
        },
        ExpectedBucketOwner: {
          name: "Expected Bucket Owner",
          description: "The account ID of the expected bucket owner.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new S3Client({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new ListBucketAnalyticsConfigurationsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Bucket Analytics Configurations Result",
      description: "Result from ListBucketAnalyticsConfigurations operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          IsTruncated: {
            type: "boolean",
            description:
              "Indicates whether the returned list of analytics configurations is complete.",
          },
          ContinuationToken: {
            type: "string",
            description:
              "The marker that is used as a starting point for this analytics configuration list response.",
          },
          NextContinuationToken: {
            type: "string",
            description:
              "NextContinuationToken is sent when isTruncated is true, which indicates that there are more analytics configurations to list.",
          },
          AnalyticsConfigurationList: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Id: {
                  type: "string",
                },
                Filter: {
                  type: "string",
                },
                StorageClassAnalysis: {
                  type: "object",
                  properties: {
                    DataExport: {
                      type: "object",
                      properties: {
                        OutputSchemaVersion: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Destination: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: ["OutputSchemaVersion", "Destination"],
                      additionalProperties: false,
                    },
                  },
                  additionalProperties: false,
                },
              },
              required: ["Id", "StorageClassAnalysis"],
              additionalProperties: false,
            },
            description: "The list of analytics configurations for a bucket.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listBucketAnalyticsConfigurations;
