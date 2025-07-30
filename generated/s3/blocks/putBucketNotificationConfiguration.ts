import { AppBlock, events } from "@slflows/sdk/v1";
import {
  S3Client,
  PutBucketNotificationConfigurationCommand,
} from "@aws-sdk/client-s3";

const putBucketNotificationConfiguration: AppBlock = {
  name: "Put Bucket Notification Configuration",
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
          description: "The name of the bucket.",
          type: "string",
          required: true,
        },
        NotificationConfiguration: {
          name: "Notification Configuration",
          description:
            "A container for specifying the notification configuration of the bucket.",
          type: {
            type: "object",
            properties: {
              TopicConfigurations: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Id: {
                      type: "string",
                    },
                    TopicArn: {
                      type: "string",
                    },
                    Events: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    Filter: {
                      type: "object",
                      properties: {
                        Key: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                  },
                  required: ["TopicArn", "Events"],
                  additionalProperties: false,
                },
              },
              QueueConfigurations: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Id: {
                      type: "string",
                    },
                    QueueArn: {
                      type: "string",
                    },
                    Events: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    Filter: {
                      type: "object",
                      properties: {
                        Key: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                  },
                  required: ["QueueArn", "Events"],
                  additionalProperties: false,
                },
              },
              LambdaFunctionConfigurations: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Id: {
                      type: "string",
                    },
                    LambdaFunctionArn: {
                      type: "string",
                    },
                    Events: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    Filter: {
                      type: "object",
                      properties: {
                        Key: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                  },
                  required: ["LambdaFunctionArn", "Events"],
                  additionalProperties: false,
                },
              },
              EventBridgeConfiguration: {
                type: "object",
                properties: {},
                additionalProperties: false,
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
        SkipDestinationValidation: {
          name: "Skip Destination Validation",
          description:
            "Skips validation of Amazon SQS, Amazon SNS, and Lambda destinations.",
          type: "boolean",
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

        const command = new PutBucketNotificationConfigurationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put Bucket Notification Configuration Result",
      description: "Result from PutBucketNotificationConfiguration operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default putBucketNotificationConfiguration;
