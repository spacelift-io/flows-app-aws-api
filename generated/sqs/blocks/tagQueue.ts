import { AppBlock, events } from "@slflows/sdk/v1";
import { SQSClient, TagQueueCommand } from "@aws-sdk/client-sqs";

const tagQueue: AppBlock = {
  name: "Tag Queue",
  description: "Add cost allocation tags to the specified Amazon SQS queue.",
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
          description: "The URL of the queue.",
          type: "string",
          required: true,
        },
        Tags: {
          name: "Tags",
          description: "The list of tags to be added to the specified queue.",
          type: {
            type: "object",
            additionalProperties: {
              type: "string",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new TagQueueCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Tag Queue Result",
      description: "Result from TagQueue operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default tagQueue;
