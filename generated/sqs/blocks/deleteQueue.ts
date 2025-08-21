import { AppBlock, events } from "@slflows/sdk/v1";
import { SQSClient, DeleteQueueCommand } from "@aws-sdk/client-sqs";

const deleteQueue: AppBlock = {
  name: "Delete Queue",
  description:
    "Deletes the queue specified by the QueueUrl, regardless of the queue's contents.",
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
          description: "The URL of the Amazon SQS queue to delete.",
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

        const command = new DeleteQueueCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Queue Result",
      description: "Result from DeleteQueue operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deleteQueue;
