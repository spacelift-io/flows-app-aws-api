import { AppBlock, events } from "@slflows/sdk/v1";
import { SQSClient, DeleteMessageBatchCommand } from "@aws-sdk/client-sqs";

const deleteMessageBatch: AppBlock = {
  name: "Delete Message Batch",
  description: "Deletes up to ten messages from the specified queue.",
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
            "The URL of the Amazon SQS queue from which messages are deleted.",
          type: "string",
          required: true,
        },
        Entries: {
          name: "Entries",
          description:
            "Lists the receipt handles for the messages to be deleted.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Id: {
                  type: "string",
                },
                ReceiptHandle: {
                  type: "string",
                },
              },
              required: ["Id", "ReceiptHandle"],
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

        const command = new DeleteMessageBatchCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Message Batch Result",
      description: "Result from DeleteMessageBatch operation",
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
              },
              required: ["Id"],
              additionalProperties: false,
            },
            description: "A list of DeleteMessageBatchResultEntry items.",
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
            description: "A list of BatchResultErrorEntry items.",
          },
        },
        required: ["Successful", "Failed"],
      },
    },
  },
};

export default deleteMessageBatch;
