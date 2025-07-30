import { AppBlock, events } from "@slflows/sdk/v1";
import { SQSClient, ReceiveMessageCommand } from "@aws-sdk/client-sqs";

const receiveMessage: AppBlock = {
  name: "Receive Message",
  description:
    "Retrieves one or more messages (up to 10), from the specified queue.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        QueueUrl: {
          name: "Queue Url",
          description:
            "The URL of the Amazon SQS queue from which messages are received.",
          type: "string",
          required: true,
        },
        AttributeNames: {
          name: "Attribute Names",
          description:
            "This parameter has been discontinued but will be supported for backward compatibility.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        MessageSystemAttributeNames: {
          name: "Message System Attribute Names",
          description:
            "A list of attributes that need to be returned along with each message.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        MessageAttributeNames: {
          name: "Message Attribute Names",
          description:
            "The name of the message attribute, where N is the index.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        MaxNumberOfMessages: {
          name: "Max Number Of Messages",
          description: "The maximum number of messages to return.",
          type: "number",
          required: false,
        },
        VisibilityTimeout: {
          name: "Visibility Timeout",
          description:
            "The duration (in seconds) that the received messages are hidden from subsequent retrieve requests after being retrieved by a ReceiveMessage request.",
          type: "number",
          required: false,
        },
        WaitTimeSeconds: {
          name: "Wait Time Seconds",
          description:
            "The duration (in seconds) for which the call waits for a message to arrive in the queue before returning.",
          type: "number",
          required: false,
        },
        ReceiveRequestAttemptId: {
          name: "Receive Request Attempt Id",
          description:
            "This parameter applies only to FIFO (first-in-first-out) queues.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new SQSClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new ReceiveMessageCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Receive Message Result",
      description: "Result from ReceiveMessage operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Messages: {
            type: "array",
            items: {
              type: "object",
              properties: {
                MessageId: {
                  type: "string",
                },
                ReceiptHandle: {
                  type: "string",
                },
                MD5OfBody: {
                  type: "string",
                },
                Body: {
                  type: "string",
                },
                Attributes: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                },
                MD5OfMessageAttributes: {
                  type: "string",
                },
                MessageAttributes: {
                  type: "object",
                  additionalProperties: {
                    type: "object",
                  },
                },
              },
              additionalProperties: false,
            },
            description: "A list of messages.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default receiveMessage;
