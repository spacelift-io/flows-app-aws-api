import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SecretsManagerClient,
  CancelRotateSecretCommand,
} from "@aws-sdk/client-secrets-manager";

const cancelRotateSecret: AppBlock = {
  name: "Cancel Rotate Secret",
  description:
    "Turns off automatic rotation, and if a rotation is currently in progress, cancels the rotation.",
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
          description: "The ARN or name of the secret.",
          type: "string",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new CancelRotateSecretCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Cancel Rotate Secret Result",
      description: "Result from CancelRotateSecret operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ARN: {
            type: "string",
            description: "The ARN of the secret.",
          },
          Name: {
            type: "string",
            description: "The name of the secret.",
          },
          VersionId: {
            type: "string",
            description:
              "The unique identifier of the version of the secret created during the rotation.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default cancelRotateSecret;
