import { AppBlock, events } from "@slflows/sdk/v1";
import { SQSClient, UntagQueueCommand } from "@aws-sdk/client-sqs";

const untagQueue: AppBlock = {
  name: "Untag Queue",
  description:
    "Remove cost allocation tags from the specified Amazon SQS queue.",
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
        TagKeys: {
          name: "Tag Keys",
          description:
            "The list of tags to be removed from the specified queue.",
          type: {
            type: "array",
            items: {
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
        });

        const command = new UntagQueueCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Untag Queue Result",
      description: "Result from UntagQueue operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default untagQueue;
