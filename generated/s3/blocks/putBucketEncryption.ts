import { AppBlock, events } from "@slflows/sdk/v1";
import { S3Client, PutBucketEncryptionCommand } from "@aws-sdk/client-s3";

const putBucketEncryption: AppBlock = {
  name: "Put Bucket Encryption",
  description:
    "This operation configures default encryption and Amazon S3 Bucket Keys for an existing bucket.",
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
            "Specifies default encryption for a bucket using server-side encryption with different key options.",
          type: "string",
          required: true,
        },
        ContentMD5: {
          name: "Content MD5",
          description:
            "The Base64 encoded 128-bit MD5 digest of the server-side encryption configuration.",
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
        ServerSideEncryptionConfiguration: {
          name: "Server Side Encryption Configuration",
          description:
            "Specifies the default server-side-encryption configuration.",
          type: {
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

        const command = new PutBucketEncryptionCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put Bucket Encryption Result",
      description: "Result from PutBucketEncryption operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default putBucketEncryption;
