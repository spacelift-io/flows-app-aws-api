import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SecretsManagerClient,
  UpdateSecretCommand,
} from "@aws-sdk/client-secrets-manager";

const updateSecret: AppBlock = {
  name: "Update Secret",
  description:
    "Modifies the details of a secret, including metadata and the secret value.",
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
        ClientRequestToken: {
          name: "Client Request Token",
          description:
            "If you include SecretString or SecretBinary, then Secrets Manager creates a new version for the secret, and this parameter specifies the unique identifier for the new version.",
          type: "string",
          required: false,
        },
        Description: {
          name: "Description",
          description: "The description of the secret.",
          type: "string",
          required: false,
        },
        KmsKeyId: {
          name: "Kms Key Id",
          description:
            "The ARN, key ID, or alias of the KMS key that Secrets Manager uses to encrypt new secret versions as well as any existing versions with the staging labels AWSCURRENT, AWSPENDING, or AWSPREVIOUS.",
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
            "The text data to encrypt and store in the new version of the secret.",
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
        });

        const command = new UpdateSecretCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Secret Result",
      description: "Result from UpdateSecret operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ARN: {
            type: "string",
            description: "The ARN of the secret that was updated.",
          },
          Name: {
            type: "string",
            description: "The name of the secret that was updated.",
          },
          VersionId: {
            type: "string",
            description:
              "If Secrets Manager created a new version of the secret during this operation, then VersionId contains the unique identifier of the new version.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default updateSecret;
