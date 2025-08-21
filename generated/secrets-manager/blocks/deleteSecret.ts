import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SecretsManagerClient,
  DeleteSecretCommand,
} from "@aws-sdk/client-secrets-manager";

const deleteSecret: AppBlock = {
  name: "Delete Secret",
  description: "Deletes a secret and all of its versions.",
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
          description: "The ARN or name of the secret to delete.",
          type: "string",
          required: true,
        },
        RecoveryWindowInDays: {
          name: "Recovery Window In Days",
          description:
            "The number of days from 7 to 30 that Secrets Manager waits before permanently deleting the secret.",
          type: "number",
          required: false,
        },
        ForceDeleteWithoutRecovery: {
          name: "Force Delete Without Recovery",
          description:
            "Specifies whether to delete the secret without any recovery window.",
          type: "boolean",
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

        const command = new DeleteSecretCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Secret Result",
      description: "Result from DeleteSecret operation",
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
          DeletionDate: {
            type: "string",
            description:
              "The date and time after which this secret Secrets Manager can permanently delete this secret, and it can no longer be restored.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deleteSecret;
