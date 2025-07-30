import { AppBlock, events } from "@slflows/sdk/v1";
import { SNSClient, GetTopicAttributesCommand } from "@aws-sdk/client-sns";

const getTopicAttributes: AppBlock = {
  name: "Get Topic Attributes",
  description: "Returns all of the properties of a topic.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        TopicArn: {
          name: "Topic Arn",
          description: "The ARN of the topic whose properties you want to get.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new SNSClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new GetTopicAttributesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Topic Attributes Result",
      description: "Result from GetTopicAttributes operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Attributes: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description: "A map of the topic's attributes.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getTopicAttributes;
