import { AppBlock, events } from "@slflows/sdk/v1";
import { KMSClient, TagResourceCommand } from "@aws-sdk/client-kms";

const tagResource: AppBlock = {
  name: "Tag Resource",
  description: "Adds or edits tags on a customer managed key.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        KeyId: {
          name: "Key Id",
          description:
            "Identifies a customer managed key in the account and Region.",
          type: "string",
          required: true,
        },
        Tags: {
          name: "Tags",
          description: "One or more tags.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                TagKey: {
                  type: "string",
                },
                TagValue: {
                  type: "string",
                },
              },
              required: ["TagKey", "TagValue"],
              additionalProperties: false,
            },
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new KMSClient({
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
        additionalProperties: true,
      },
    },
  },
};

export default tagResource;
