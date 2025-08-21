import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EventBridgeClient,
  TagResourceCommand,
} from "@aws-sdk/client-eventbridge";

const tagResource: AppBlock = {
  name: "Tag Resource",
  description:
    "Assigns one or more tags (key-value pairs) to the specified EventBridge resource.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ResourceARN: {
          name: "Resource ARN",
          description:
            "The ARN of the EventBridge resource that you're adding tags to.",
          type: "string",
          required: true,
        },
        Tags: {
          name: "Tags",
          description:
            "The list of key-value pairs to associate with the resource.",
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
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new EventBridgeClient({
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
