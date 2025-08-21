import { AppBlock, events } from "@slflows/sdk/v1";
import {
  S3Client,
  GetBucketNotificationConfigurationCommand,
} from "@aws-sdk/client-s3";
import { serializeAWSResponse } from "../utils/serialize";

const getBucketNotificationConfiguration: AppBlock = {
  name: "Get Bucket Notification Configuration",
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
            "The name of the bucket for which to get the notification configuration.",
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

        const command = new GetBucketNotificationConfigurationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        // Safely serialize response by handling circular references and streams
        const safeResponse = await serializeAWSResponse(response);
        await events.emit(safeResponse || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Bucket Notification Configuration Result",
      description: "Result from GetBucketNotificationConfiguration operation",
      possiblePrimaryParents: ["default"],
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
                    type: "string",
                  },
                },
                Filter: {
                  type: "object",
                  properties: {
                    Key: {
                      type: "object",
                      properties: {
                        FilterRules: {
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
              required: ["TopicArn", "Events"],
              additionalProperties: false,
            },
            description:
              "The topic to which notifications are sent and the events for which notifications are generated.",
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
                    type: "string",
                  },
                },
                Filter: {
                  type: "object",
                  properties: {
                    Key: {
                      type: "object",
                      properties: {
                        FilterRules: {
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
              required: ["QueueArn", "Events"],
              additionalProperties: false,
            },
            description:
              "The Amazon Simple Queue Service queues to publish messages to and the events for which to publish messages.",
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
                    type: "string",
                  },
                },
                Filter: {
                  type: "object",
                  properties: {
                    Key: {
                      type: "object",
                      properties: {
                        FilterRules: {
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
              required: ["LambdaFunctionArn", "Events"],
              additionalProperties: false,
            },
            description:
              "Describes the Lambda functions to invoke and the events for which to invoke them.",
          },
          EventBridgeConfiguration: {
            type: "object",
            properties: {},
            additionalProperties: false,
            description: "Enables delivery of events to Amazon EventBridge.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getBucketNotificationConfiguration;
