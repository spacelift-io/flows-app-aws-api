import { AppBlock, events } from "@slflows/sdk/v1";
import { SQSClient, SetQueueAttributesCommand } from "@aws-sdk/client-sqs";

const setQueueAttributes: AppBlock = {
  name: "Set Queue Attributes",
  description: "Sets the value of one or more queue attributes, like a policy.",
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
            "The URL of the Amazon SQS queue whose attributes are set.",
          type: "string",
          required: true,
        },
        Attributes: {
          name: "Attributes",
          description: "A map of attributes to set.",
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
        });

        const command = new SetQueueAttributesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Set Queue Attributes Result",
      description: "Result from SetQueueAttributes operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default setQueueAttributes;
