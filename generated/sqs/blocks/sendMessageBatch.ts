import { AppBlock, events } from "@slflows/sdk/v1";
import { SQSClient, SendMessageBatchCommand } from "@aws-sdk/client-sqs";

const sendMessageBatch: AppBlock = {
  name: "Send Message Batch",
  description:
    "You can use SendMessageBatch to send up to 10 messages to the specified queue by assigning either identical or different values to each message (or by not assigning values at all).",
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
            "The URL of the Amazon SQS queue to which batched messages are sent.",
          type: "string",
          required: true,
        },
        Entries: {
          name: "Entries",
          description: "A list of SendMessageBatchRequestEntry items.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Id: {
                  type: "string",
                },
                MessageBody: {
                  type: "string",
                },
                DelaySeconds: {
                  type: "number",
                },
                MessageAttributes: {
                  type: "object",
                  additionalProperties: {
                    type: "object",
                  },
                },
                MessageSystemAttributes: {
                  type: "object",
                  additionalProperties: {
                    type: "object",
                  },
                },
                MessageDeduplicationId: {
                  type: "string",
                },
                MessageGroupId: {
                  type: "string",
                },
              },
              required: ["Id", "MessageBody"],
              additionalProperties: false,
            },
          },
          required: true,
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

        const command = new SendMessageBatchCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Send Message Batch Result",
      description: "Result from SendMessageBatch operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Successful: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Id: {
                  type: "string",
                },
                MessageId: {
                  type: "string",
                },
                MD5OfMessageBody: {
                  type: "string",
                },
                MD5OfMessageAttributes: {
                  type: "string",
                },
                MD5OfMessageSystemAttributes: {
                  type: "string",
                },
                SequenceNumber: {
                  type: "string",
                },
              },
              required: ["Id", "MessageId", "MD5OfMessageBody"],
              additionalProperties: false,
            },
            description: "A list of SendMessageBatchResultEntry items.",
          },
          Failed: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Id: {
                  type: "string",
                },
                SenderFault: {
                  type: "boolean",
                },
                Code: {
                  type: "string",
                },
                Message: {
                  type: "string",
                },
              },
              required: ["Id", "SenderFault", "Code"],
              additionalProperties: false,
            },
            description:
              "A list of BatchResultErrorEntry items with error details about each message that can't be enqueued.",
          },
        },
        required: ["Successful", "Failed"],
      },
    },
  },
};

export default sendMessageBatch;
