import { AppBlock, events } from "@slflows/sdk/v1";
import { ECSClient, TagResourceCommand } from "@aws-sdk/client-ecs";

const tagResource: AppBlock = {
  name: "Tag Resource",
  description:
    "Associates the specified tags to a resource with the specified resourceArn.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        resourceArn: {
          name: "resource Arn",
          description:
            "The Amazon Resource Name (ARN) of the resource to add tags to.",
          type: "string",
          required: true,
        },
        tags: {
          name: "tags",
          description: "The tags to add to the resource.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                key: {
                  type: "string",
                },
                value: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new ECSClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new TagResourceCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Tag Resource Result",
      description: "Result from TagResource operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default tagResource;
