import { AppBlock, events } from "@slflows/sdk/v1";
import { SNSClient, ListTagsForResourceCommand } from "@aws-sdk/client-sns";

const listTagsForResource: AppBlock = {
  name: "List Tags For Resource",
  description: "List all tags added to the specified Amazon SNS topic.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ResourceArn: {
          name: "Resource Arn",
          description: "The ARN of the topic for which to list tags.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new ListTagsForResourceCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Tags For Resource Result",
      description: "Result from ListTagsForResource operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Tags: {
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
            description: "The tags associated with the specified topic.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listTagsForResource;
