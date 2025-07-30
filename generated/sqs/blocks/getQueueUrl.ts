import { AppBlock, events } from "@slflows/sdk/v1";
import { SQSClient, GetQueueUrlCommand } from "@aws-sdk/client-sqs";

const getQueueUrl: AppBlock = {
  name: "Get Queue Url",
  description:
    "The GetQueueUrl API returns the URL of an existing Amazon SQS queue.",
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
          description:
            "(Required) The name of the queue for which you want to fetch the URL.",
          type: "string",
          required: true,
        },
        QueueOwnerAWSAccountId: {
          name: "Queue Owner AWS Account Id",
          description:
            "(Optional) The Amazon Web Services account ID of the account that created the queue.",
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

        const command = new GetQueueUrlCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Queue Url Result",
      description: "Result from GetQueueUrl operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          QueueUrl: {
            type: "string",
            description: "The URL of the queue.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getQueueUrl;
