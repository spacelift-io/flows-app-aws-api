import { AppBlock, events } from "@slflows/sdk/v1";
import {
  S3Client,
  PutBucketAccelerateConfigurationCommand,
} from "@aws-sdk/client-s3";

const putBucketAccelerateConfiguration: AppBlock = {
  name: "Put Bucket Accelerate Configuration",
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
            "The name of the bucket for which the accelerate configuration is set.",
          type: "string",
          required: true,
        },
        AccelerateConfiguration: {
          name: "Accelerate Configuration",
          description: "Container for setting the transfer acceleration state.",
          type: {
            type: "object",
            properties: {
              Status: {
                type: "string",
              },
            },
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
        ChecksumAlgorithm: {
          name: "Checksum Algorithm",
          description:
            "Indicates the algorithm used to create the checksum for the request when you use the SDK.",
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

        const command = new PutBucketAccelerateConfigurationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put Bucket Accelerate Configuration Result",
      description: "Result from PutBucketAccelerateConfiguration operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default putBucketAccelerateConfiguration;
