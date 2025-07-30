import { AppBlock, events } from "@slflows/sdk/v1";
import {
  S3Client,
  PutBucketAnalyticsConfigurationCommand,
} from "@aws-sdk/client-s3";

const putBucketAnalyticsConfiguration: AppBlock = {
  name: "Put Bucket Analytics Configuration",
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
            "The name of the bucket to which an analytics configuration is stored.",
          type: "string",
          required: true,
        },
        Id: {
          name: "Id",
          description: "The ID that identifies the analytics configuration.",
          type: "string",
          required: true,
        },
        AnalyticsConfiguration: {
          name: "Analytics Configuration",
          description:
            "The configuration and any analyses for the analytics filter.",
          type: {
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
                        type: "string",
                      },
                      Destination: {
                        type: "object",
                        properties: {
                          S3BucketDestination: {
                            type: "object",
                            additionalProperties: true,
                          },
                        },
                        required: ["S3BucketDestination"],
                        additionalProperties: false,
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
          required: true,
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

        const command = new PutBucketAnalyticsConfigurationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put Bucket Analytics Configuration Result",
      description: "Result from PutBucketAnalyticsConfiguration operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default putBucketAnalyticsConfiguration;
