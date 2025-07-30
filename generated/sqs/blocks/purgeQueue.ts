import { AppBlock, events } from "@slflows/sdk/v1";
import { SQSClient, PurgeQueueCommand } from "@aws-sdk/client-sqs";

const purgeQueue: AppBlock = {
  name: "Purge Queue",
  description:
    "Deletes available messages in a queue (including in-flight messages) specified by the QueueURL parameter.",
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
            "The URL of the queue from which the PurgeQueue action deletes messages.",
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

        const command = new PurgeQueueCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Purge Queue Result",
      description: "Result from PurgeQueue operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default purgeQueue;
