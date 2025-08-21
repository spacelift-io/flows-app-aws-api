import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SecretsManagerClient,
  PutSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

const putSecretValue: AppBlock = {
  name: "Put Secret Value",
  description:
    "Creates a new version with a new encrypted secret value and attaches it to the secret.",
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
          description: "The ARN or name of the secret to add a new version to.",
          type: "string",
          required: true,
        },
        ClientRequestToken: {
          name: "Client Request Token",
          description: "A unique identifier for the new version of the secret.",
          type: "string",
          required: false,
        },
        SecretBinary: {
          name: "Secret Binary",
          description:
            "The binary data to encrypt and store in the new version of the secret.",
          type: "string",
          required: false,
        },
        SecretString: {
          name: "Secret String",
          description:
            "The text to encrypt and store in the new version of the secret.",
          type: "string",
          required: false,
        },
        VersionStages: {
          name: "Version Stages",
          description:
            "A list of staging labels to attach to this version of the secret.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        RotationToken: {
          name: "Rotation Token",
          description:
            "A unique identifier that indicates the source of the request.",
          type: "string",
          required: false,
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

        const command = new PutSecretValueCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put Secret Value Result",
      description: "Result from PutSecretValue operation",
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
            description: "The unique identifier of the version of the secret.",
          },
          VersionStages: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "The list of staging labels that are currently attached to this version of the secret.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default putSecretValue;
