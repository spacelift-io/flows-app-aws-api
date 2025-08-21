import { AppBlock, events } from "@slflows/sdk/v1";
import { SQSClient, DeleteMessageCommand } from "@aws-sdk/client-sqs";

const deleteMessage: AppBlock = {
  name: "Delete Message",
  description: "Deletes the specified message from the specified queue.",
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
        ReceiptHandle: {
          name: "Receipt Handle",
          description:
            "The receipt handle associated with the message to delete.",
          type: "string",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new DeleteMessageCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Message Result",
      description: "Result from DeleteMessage operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deleteMessage;
