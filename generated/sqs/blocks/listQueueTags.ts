import { AppBlock, events } from "@slflows/sdk/v1";
import { SQSClient, ListQueueTagsCommand } from "@aws-sdk/client-sqs";

const listQueueTags: AppBlock = {
  name: "List Queue Tags",
  description:
    "List all cost allocation tags added to the specified Amazon SQS queue.",
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

        const command = new ListQueueTagsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Queue Tags Result",
      description: "Result from ListQueueTags operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Tags: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description: "The list of all tags added to the specified queue.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listQueueTags;
