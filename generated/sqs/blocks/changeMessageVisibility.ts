import { AppBlock, events } from "@slflows/sdk/v1";
import { SQSClient, ChangeMessageVisibilityCommand } from "@aws-sdk/client-sqs";

const changeMessageVisibility: AppBlock = {
  name: "Change Message Visibility",
  description:
    "Changes the visibility timeout of a specified message in a queue to a new value.",
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
            "The URL of the Amazon SQS queue whose message's visibility is changed.",
          type: "string",
          required: true,
        },
        ReceiptHandle: {
          name: "Receipt Handle",
          description:
            "The receipt handle associated with the message, whose visibility timeout is changed.",
          type: "string",
          required: true,
        },
        VisibilityTimeout: {
          name: "Visibility Timeout",
          description:
            "The new value for the message's visibility timeout (in seconds).",
          type: "number",
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

        const command = new ChangeMessageVisibilityCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Change Message Visibility Result",
      description: "Result from ChangeMessageVisibility operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default changeMessageVisibility;
