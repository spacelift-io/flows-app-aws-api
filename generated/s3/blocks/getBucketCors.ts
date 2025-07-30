import { AppBlock, events } from "@slflows/sdk/v1";
import { S3Client, GetBucketCorsCommand } from "@aws-sdk/client-s3";

const getBucketCors: AppBlock = {
  name: "Get Bucket Cors",
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
            "The bucket name for which to get the cors configuration.",
          type: "string",
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

        const command = new GetBucketCorsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Bucket Cors Result",
      description: "Result from GetBucketCors operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          CORSRules: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ID: {
                  type: "string",
                },
                AllowedHeaders: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                AllowedMethods: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                AllowedOrigins: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                ExposeHeaders: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                MaxAgeSeconds: {
                  type: "number",
                },
              },
              required: ["AllowedMethods", "AllowedOrigins"],
              additionalProperties: false,
            },
            description:
              "A set of origins and methods (cross-origin access that you want to allow).",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getBucketCors;
