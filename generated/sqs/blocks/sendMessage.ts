import { AppBlock, events } from "@slflows/sdk/v1";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const sendMessage: AppBlock = {
  name: "Send Message",
  description: "Delivers a message to the specified queue.",
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
            "The URL of the Amazon SQS queue to which a message is sent.",
          type: "string",
          required: true,
        },
        MessageBody: {
          name: "Message Body",
          description: "The message to send.",
          type: "string",
          required: true,
        },
        DelaySeconds: {
          name: "Delay Seconds",
          description:
            "The length of time, in seconds, for which to delay a specific message.",
          type: "number",
          required: false,
        },
        MessageAttributes: {
          name: "Message Attributes",
          description:
            "Each message attribute consists of a Name, Type, and Value.",
          type: {
            type: "object",
            additionalProperties: {
              type: "object",
            },
          },
          required: false,
        },
        MessageSystemAttributes: {
          name: "Message System Attributes",
          description: "The message system attribute to send.",
          type: {
            type: "object",
            additionalProperties: {
              type: "object",
            },
          },
          required: false,
        },
        MessageDeduplicationId: {
          name: "Message Deduplication Id",
          description:
            "This parameter applies only to FIFO (first-in-first-out) queues.",
          type: "string",
          required: false,
        },
        MessageGroupId: {
          name: "Message Group Id",
          description:
            "MessageGroupId is an attribute used in Amazon SQS FIFO (First-In-First-Out) and standard queues.",
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

        const command = new SendMessageCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Send Message Result",
      description: "Result from SendMessage operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          MD5OfMessageBody: {
            type: "string",
            description:
              "An MD5 digest of the non-URL-encoded message body string.",
          },
          MD5OfMessageAttributes: {
            type: "string",
            description:
              "An MD5 digest of the non-URL-encoded message attribute string.",
          },
          MD5OfMessageSystemAttributes: {
            type: "string",
            description:
              "An MD5 digest of the non-URL-encoded message system attribute string.",
          },
          MessageId: {
            type: "string",
            description:
              "An attribute containing the MessageId of the message sent to the queue.",
          },
          SequenceNumber: {
            type: "string",
            description:
              "This parameter applies only to FIFO (first-in-first-out) queues.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default sendMessage;
