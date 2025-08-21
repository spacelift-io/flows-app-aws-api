import { AppBlock, events } from "@slflows/sdk/v1";
import { SQSClient, GetQueueAttributesCommand } from "@aws-sdk/client-sqs";

const getQueueAttributes: AppBlock = {
  name: "Get Queue Attributes",
  description: "Gets attributes for the specified queue.",
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
            "The URL of the Amazon SQS queue whose attribute information is retrieved.",
          type: "string",
          required: true,
        },
        AttributeNames: {
          name: "Attribute Names",
          description:
            "A list of attributes for which to retrieve information.",
          type: {
            type: "array",
            items: {
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new GetQueueAttributesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Queue Attributes Result",
      description: "Result from GetQueueAttributes operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Attributes: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description: "A map of attributes to their respective values.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getQueueAttributes;
