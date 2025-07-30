import { AppBlock, events } from "@slflows/sdk/v1";
import {
  S3Client,
  PutBucketMetricsConfigurationCommand,
} from "@aws-sdk/client-s3";

const putBucketMetricsConfiguration: AppBlock = {
  name: "Put Bucket Metrics Configuration",
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
            "The name of the bucket for which the metrics configuration is set.",
          type: "string",
          required: true,
        },
        Id: {
          name: "Id",
          description: "The ID used to identify the metrics configuration.",
          type: "string",
          required: true,
        },
        MetricsConfiguration: {
          name: "Metrics Configuration",
          description: "Specifies the metrics configuration.",
          type: {
            type: "object",
            properties: {
              Id: {
                type: "string",
              },
              Filter: {
                type: "string",
              },
            },
            required: ["Id"],
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

        const command = new PutBucketMetricsConfigurationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put Bucket Metrics Configuration Result",
      description: "Result from PutBucketMetricsConfiguration operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default putBucketMetricsConfiguration;
