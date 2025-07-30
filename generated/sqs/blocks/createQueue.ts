import { AppBlock, events } from "@slflows/sdk/v1";
import { SQSClient, CreateQueueCommand } from "@aws-sdk/client-sqs";

const createQueue: AppBlock = {
  name: "Create Queue",
  description: "Creates a new standard or FIFO queue.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        QueueName: {
          name: "Queue Name",
          description: "The name of the new queue.",
          type: "string",
          required: true,
        },
        Attributes: {
          name: "Attributes",
          description: "A map of attributes with their corresponding values.",
          type: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
          },
          required: false,
        },
        tags: {
          name: "tags",
          description:
            "Add cost allocation tags to the specified Amazon SQS queue.",
          type: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
          },
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

        const command = new CreateQueueCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Queue Result",
      description: "Result from CreateQueue operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          QueueUrl: {
            type: "string",
            description: "The URL of the created Amazon SQS queue.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createQueue;
