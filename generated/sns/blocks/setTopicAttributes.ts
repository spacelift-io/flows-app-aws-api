import { AppBlock, events } from "@slflows/sdk/v1";
import { SNSClient, SetTopicAttributesCommand } from "@aws-sdk/client-sns";

const setTopicAttributes: AppBlock = {
  name: "Set Topic Attributes",
  description:
    "Allows a topic owner to set an attribute of the topic to a new value.",
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
          description: "The ARN of the topic to modify.",
          type: "string",
          required: true,
        },
        AttributeName: {
          name: "Attribute Name",
          description: "A map of attributes with their corresponding values.",
          type: "string",
          required: true,
        },
        AttributeValue: {
          name: "Attribute Value",
          description: "The new value for the attribute.",
          type: "string",
          required: false,
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new SetTopicAttributesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Set Topic Attributes Result",
      description: "Result from SetTopicAttributes operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default setTopicAttributes;
