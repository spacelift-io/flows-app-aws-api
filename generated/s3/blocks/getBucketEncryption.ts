import { AppBlock, events } from "@slflows/sdk/v1";
import { S3Client, GetBucketEncryptionCommand } from "@aws-sdk/client-s3";
import { serializeAWSResponse } from "../utils/serialize";

const getBucketEncryption: AppBlock = {
  name: "Get Bucket Encryption",
  description:
    "Returns the default encryption configuration for an Amazon S3 bucket.",
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
            "The name of the bucket from which the server-side encryption configuration is retrieved.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new GetBucketEncryptionCommand(commandInput as any);
        const response = await client.send(command);

        // Safely serialize response by handling circular references and streams
        const safeResponse = await serializeAWSResponse(response);
        await events.emit(safeResponse || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Bucket Encryption Result",
      description: "Result from GetBucketEncryption operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ServerSideEncryptionConfiguration: {
            type: "object",
            properties: {
              Rules: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    ApplyServerSideEncryptionByDefault: {
                      type: "object",
                      properties: {
                        SSEAlgorithm: {
                          type: "object",
                          additionalProperties: true,
                        },
                        KMSMasterKeyID: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: ["SSEAlgorithm"],
                      additionalProperties: false,
                    },
                    BucketKeyEnabled: {
                      type: "boolean",
                    },
                  },
                  additionalProperties: false,
                },
              },
            },
            required: ["Rules"],
            additionalProperties: false,
            description:
              "Specifies the default server-side-encryption configuration.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getBucketEncryption;
