import { AppBlock, events } from "@slflows/sdk/v1";
import { S3Client, PutBucketLoggingCommand } from "@aws-sdk/client-s3";
import { serializeAWSResponse } from "../utils/serialize";

const putBucketLogging: AppBlock = {
  name: "Put Bucket Logging",
  description:
    "End of support notice: Beginning October 1, 2025, Amazon S3 will discontinue support for creating new Email Grantee Access Control Lists (ACL).",
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
            "The name of the bucket for which to set the logging parameters.",
          type: "string",
          required: true,
        },
        BucketLoggingStatus: {
          name: "Bucket Logging Status",
          description: "Container for logging status information.",
          type: {
            type: "object",
            properties: {
              LoggingEnabled: {
                type: "object",
                properties: {
                  TargetBucket: {
                    type: "string",
                  },
                  TargetGrants: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        Grantee: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Permission: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                  },
                  TargetPrefix: {
                    type: "string",
                  },
                  TargetObjectKeyFormat: {
                    type: "object",
                    properties: {
                      SimplePrefix: {
                        type: "object",
                        properties: {},
                        additionalProperties: false,
                      },
                      PartitionedPrefix: {
                        type: "object",
                        properties: {
                          PartitionDateSource: {
                            type: "object",
                            additionalProperties: true,
                          },
                        },
                        additionalProperties: false,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                required: ["TargetBucket", "TargetPrefix"],
                additionalProperties: false,
              },
            },
            additionalProperties: false,
          },
          required: true,
        },
        ContentMD5: {
          name: "Content MD5",
          description: "The MD5 hash of the PutBucketLogging request body.",
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

        const command = new PutBucketLoggingCommand(commandInput as any);
        const response = await client.send(command);

        // Safely serialize response by handling circular references and streams
        const safeResponse = await serializeAWSResponse(response);
        await events.emit(safeResponse || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put Bucket Logging Result",
      description: "Result from PutBucketLogging operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default putBucketLogging;
