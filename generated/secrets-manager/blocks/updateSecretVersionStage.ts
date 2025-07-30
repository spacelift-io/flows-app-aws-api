import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SecretsManagerClient,
  UpdateSecretVersionStageCommand,
} from "@aws-sdk/client-secrets-manager";

const updateSecretVersionStage: AppBlock = {
  name: "Update Secret Version Stage",
  description: "Modifies the staging labels attached to a version of a secret.",
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
          description:
            "The ARN or the name of the secret with the version and staging labelsto modify.",
          type: "string",
          required: true,
        },
        VersionStage: {
          name: "Version Stage",
          description: "The staging label to add to this version.",
          type: "string",
          required: true,
        },
        RemoveFromVersionId: {
          name: "Remove From Version Id",
          description:
            "The ID of the version that the staging label is to be removed from.",
          type: "string",
          required: false,
        },
        MoveToVersionId: {
          name: "Move To Version Id",
          description: "The ID of the version to add the staging label to.",
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

        const command = new UpdateSecretVersionStageCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Secret Version Stage Result",
      description: "Result from UpdateSecretVersionStage operation",
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
        },
        additionalProperties: true,
      },
    },
  },
};

export default updateSecretVersionStage;
