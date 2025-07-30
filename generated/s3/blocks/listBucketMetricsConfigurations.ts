import { AppBlock, events } from "@slflows/sdk/v1";
import {
  S3Client,
  ListBucketMetricsConfigurationsCommand,
} from "@aws-sdk/client-s3";

const listBucketMetricsConfigurations: AppBlock = {
  name: "List Bucket Metrics Configurations",
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
            "The name of the bucket containing the metrics configurations to retrieve.",
          type: "string",
          required: true,
        },
        ContinuationToken: {
          name: "Continuation Token",
          description:
            "The marker that is used to continue a metrics configuration listing that has been truncated.",
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

        const command = new ListBucketMetricsConfigurationsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Bucket Metrics Configurations Result",
      description: "Result from ListBucketMetricsConfigurations operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          IsTruncated: {
            type: "boolean",
            description:
              "Indicates whether the returned list of metrics configurations is complete.",
          },
          ContinuationToken: {
            type: "string",
            description:
              "The marker that is used as a starting point for this metrics configuration list response.",
          },
          NextContinuationToken: {
            type: "string",
            description:
              "The marker used to continue a metrics configuration listing that has been truncated.",
          },
          MetricsConfigurationList: {
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
              },
              required: ["Id"],
              additionalProperties: false,
            },
            description: "The list of metrics configurations for a bucket.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listBucketMetricsConfigurations;
