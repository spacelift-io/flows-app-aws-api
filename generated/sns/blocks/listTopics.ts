import { AppBlock, events } from "@slflows/sdk/v1";
import { SNSClient, ListTopicsCommand } from "@aws-sdk/client-sns";

const listTopics: AppBlock = {
  name: "List Topics",
  description: "Returns a list of the requester's topics.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        NextToken: {
          name: "Next Token",
          description: "Token returned by the previous ListTopics request.",
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

        const command = new ListTopicsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Topics Result",
      description: "Result from ListTopics operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Topics: {
            type: "array",
            items: {
              type: "object",
              properties: {
                TopicArn: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "A list of topic ARNs.",
          },
          NextToken: {
            type: "string",
            description: "Token to pass along to the next ListTopics request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listTopics;
