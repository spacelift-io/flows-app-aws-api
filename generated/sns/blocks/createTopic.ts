import { AppBlock, events } from "@slflows/sdk/v1";
import { SNSClient, CreateTopicCommand } from "@aws-sdk/client-sns";

const createTopic: AppBlock = {
  name: "Create Topic",
  description: "Creates a topic to which notifications can be published.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Name: {
          name: "Name",
          description: "The name of the topic you want to create.",
          type: "string",
          required: true,
        },
        Attributes: {
          name: "Attributes",
          description: "A map of attributes with their corresponding values.",
          type: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
          },
          required: false,
        },
        Tags: {
          name: "Tags",
          description: "The list of tags to add to a new topic.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Key: {
                  type: "string",
                },
                Value: {
                  type: "string",
                },
              },
              required: ["Key", "Value"],
              additionalProperties: false,
            },
          },
          required: false,
        },
        DataProtectionPolicy: {
          name: "Data Protection Policy",
          description:
            "The body of the policy document you want to use for this topic.",
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
        });

        const command = new CreateTopicCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Topic Result",
      description: "Result from CreateTopic operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          TopicArn: {
            type: "string",
            description:
              "The Amazon Resource Name (ARN) assigned to the created topic.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createTopic;
