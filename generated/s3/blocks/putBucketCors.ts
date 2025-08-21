import { AppBlock, events } from "@slflows/sdk/v1";
import { S3Client, PutBucketCorsCommand } from "@aws-sdk/client-s3";
import { serializeAWSResponse } from "../utils/serialize";

const putBucketCors: AppBlock = {
  name: "Put Bucket Cors",
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
            "Specifies the bucket impacted by the corsconfiguration.",
          type: "string",
          required: true,
        },
        CORSConfiguration: {
          name: "CORS Configuration",
          description:
            "Describes the cross-origin access configuration for objects in an Amazon S3 bucket.",
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
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    AllowedMethods: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    AllowedOrigins: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    ExposeHeaders: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    MaxAgeSeconds: {
                      type: "number",
                    },
                  },
                  required: ["AllowedMethods", "AllowedOrigins"],
                  additionalProperties: false,
                },
              },
            },
            required: ["CORSRules"],
            additionalProperties: false,
          },
          required: true,
        },
        ContentMD5: {
          name: "Content MD5",
          description: "The Base64 encoded 128-bit MD5 digest of the data.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new PutBucketCorsCommand(commandInput as any);
        const response = await client.send(command);

        // Safely serialize response by handling circular references and streams
        const safeResponse = await serializeAWSResponse(response);
        await events.emit(safeResponse || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put Bucket Cors Result",
      description: "Result from PutBucketCors operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default putBucketCors;
