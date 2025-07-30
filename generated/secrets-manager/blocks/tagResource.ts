import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SecretsManagerClient,
  TagResourceCommand,
} from "@aws-sdk/client-secrets-manager";

const tagResource: AppBlock = {
  name: "Tag Resource",
  description: "Attaches tags to a secret.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        SecretId: {
          name: "Secret Id",
          description: "The identifier for the secret to attach tags to.",
          type: "string",
          required: true,
        },
        Tags: {
          name: "Tags",
          description:
            "The tags to attach to the secret as a JSON text string argument.",
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
              additionalProperties: false,
            },
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new SecretsManagerClient({
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
        additionalProperties: true,
      },
    },
  },
};

export default tagResource;
