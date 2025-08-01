import { AppBlock, events } from "@slflows/sdk/v1";
import { S3Client, GetBucketLoggingCommand } from "@aws-sdk/client-s3";

const getBucketLogging: AppBlock = {
  name: "Get Bucket Logging",
  description:
    "End of support notice: Beginning October 1, 2025, Amazon S3 will stop returning DisplayName.",
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
            "The bucket name for which to get the logging information.",
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

        const command = new GetBucketLoggingCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Bucket Logging Result",
      description: "Result from GetBucketLogging operation",
      possiblePrimaryParents: ["default"],
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
                      properties: {
                        DisplayName: {
                          type: "object",
                          additionalProperties: true,
                        },
                        EmailAddress: {
                          type: "object",
                          additionalProperties: true,
                        },
                        ID: {
                          type: "object",
                          additionalProperties: true,
                        },
                        URI: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Type: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: ["Type"],
                      additionalProperties: false,
                    },
                    Permission: {
                      type: "string",
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
                        type: "string",
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
            description:
              "Describes where logs are stored and the prefix that Amazon S3 assigns to all log object keys for a bucket.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getBucketLogging;
